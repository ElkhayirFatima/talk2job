import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  Mic,
  MicOff,
  Clock,
  Radio,
  User,
  Bot,
  Loader2,
  AlertCircle,
  CheckCircle2,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";
import { startInterviewSession, submitAudioAnswer } from "../../api/interview";
import useAuth from "../../hooks/useAuth";

const INTERVIEW_AUDIO_BASE = "http://localhost:8001";

// ── WAV Encoding Utilities ──

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function encodeWav(audioBuffer) {
  const sampleRate = audioBuffer.sampleRate;
  const samples = audioBuffer.getChannelData(0);
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

async function convertToWav(blob) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return encodeWav(audioBuffer);
  } finally {
    audioCtx.close();
  }
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function AIWaveVisualizer({ active }) {
  return (
    <div className="flex items-end gap-[3px] h-16 justify-center">
      {Array.from({ length: 32 }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-150 ${
            active
              ? "bg-gradient-to-t from-indigo-500 to-violet-400"
              : "bg-slate-700/60"
          }`}
          style={{
            height: active
              ? `${20 + Math.random() * 80}%`
              : `${10 + Math.random() * 15}%`,
            animationName: active ? "aiWave" : "none",
            animationDuration: `${0.25 + Math.random() * 0.4}s`,
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
      <style>{`
        @keyframes aiWave {
          0% { height: 12%; }
          100% { height: ${50 + Math.random() * 50}%; }
        }
      `}</style>
    </div>
  );
}

function CandidateRing({ recording }) {
  return (
    <div
      className={`relative h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 ${
        recording
          ? "ring-4 ring-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.3)]"
          : "ring-2 ring-slate-700"
      }`}
    >
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
          recording ? "opacity-100 animate-ping" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)",
        }}
      />
      <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        <User className="h-9 w-9 text-slate-500 dark:text-slate-400" />
      </div>
    </div>
  );
}

export default function InterviewSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { auth } = useAuth();

  // Read context from navigation state (from "Simulate Interview" button)
  const navState = location.state ?? {};

  // Session state
  const [interviewId, setInterviewId] = useState(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer (counts UP)
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Audio playback
  const [aiPlaying, setAiPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  // Recording state
  const [recording, setRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingStartTimeRef = useRef(0);

  // Transcript feed
  const [transcript, setTranscript] = useState([]);
  const feedRef = useRef(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [transcript]);

  // Timer: count up
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.src = "";
    };
  }, []);

  const playAIAudio = useCallback((audioUrl) => {
    if (!audioUrl) {
      setAiPlaying(false);
      return;
    }
    const cleanPath = audioUrl.replace(/^\/+/, "");
    const fullUrl = audioUrl.startsWith("http")
      ? audioUrl
      : `${INTERVIEW_AUDIO_BASE}/${cleanPath}`;
    const audio = audioRef.current;
    audio.src = fullUrl;
    audio.onplay = () => setAiPlaying(true);
    audio.onended = () => setAiPlaying(false);
    audio.onerror = () => setAiPlaying(false);
    audio.play().catch(() => setAiPlaying(false));
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const resumeId =
        navState.resume_id ||
        searchParams.get("resumeId") ||
        localStorage.getItem("resumeId");
      const jobId = navState.job_id || searchParams.get("jobId") || "";
      const jobTitle =
        navState.job_title ||
        searchParams.get("jobTitle") ||
        "Software Engineer";
      const userId = navState.user_id || auth?.userId || "1";

      const res = await startInterviewSession({
        resume_text: "",
        job_title: jobTitle,
        resume_id: resumeId ? parseInt(resumeId) : 0,
        user_id: parseInt(userId) || 1,
        job_id: jobId && !isNaN(parseInt(jobId)) ? parseInt(jobId) : 0,
      });

      const data = res.data;
      setInterviewId(data.interview_id);
      setStarted(true);

      // Push initial AI question to transcript
      if (data.question) {
        setTranscript([{ role: "ai", content: data.question }]);
      }

      // Play the greeting audio
      if (data.audio_url) {
        playAIAudio(data.audio_url);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to start interview session.",
      );
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Pick best supported mimeType across browsers
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      const options = mimeType ? { mimeType } : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      recordingStartTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const rawBlob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        // Guard against empty / corrupt blobs
        if (rawBlob.size < 100) {
          setError("Recording too short or empty. Please try again.");
          return;
        }

        // Convert browser-native webm/ogg → proper PCM WAV for backend STT
        try {
          const wavBlob = await convertToWav(rawBlob);
          await sendAudio(wavBlob);
        } catch {
          // Fallback: send raw blob (Whisper can often still handle it)
          await sendAudio(rawBlob);
        }
      };

      // Collect chunks every 250ms so short recordings aren't lost
      mediaRecorder.start(250);
      setRecording(true);
    } catch {
      setError("Microphone access denied. Please enable mic permissions.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      const elapsed = Date.now() - recordingStartTimeRef.current;
      const MIN_DURATION_MS = 500;

      if (elapsed < MIN_DURATION_MS) {
        // Let recording continue briefly so short utterances are captured
        setTimeout(() => {
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
          ) {
            mediaRecorderRef.current.requestData(); // flush pending chunk
            mediaRecorderRef.current.stop();
          }
          setRecording(false);
        }, MIN_DURATION_MS - elapsed);
      } else {
        mediaRecorderRef.current.requestData(); // flush pending chunk
        mediaRecorderRef.current.stop();
        setRecording(false);
      }
    }
  };

  const sendAudio = async (blob) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await submitAudioAnswer(interviewId, blob);
      const data = res.data;

      // Push candidate transcript
      if (data.transcript) {
        setTranscript((prev) => [
          ...prev,
          { role: "candidate", content: data.transcript },
        ]);
      }

      // Push AI next question
      if (data.next_question) {
        setTranscript((prev) => [
          ...prev,
          { role: "ai", content: data.next_question },
        ]);
      }

      // Play AI audio
      if (data.audio_url) {
        playAIAudio(data.audio_url);
      }

      // Check completion
      if (data.status === "finished") {
        setFinished(true);
        setPerformance(data.performance ?? null);
        clearInterval(timerRef.current);
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to process audio. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMic = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Mic disabled when AI is playing or submitting
  const micDisabled = aiPlaying || submitting || loading;

  // ─── Pre-start Screen ───
  if (!started) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950 p-6 min-h-screen">
        <div className="max-w-md w-full text-center">
          <div className="h-24 w-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-600/20 dark:to-violet-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mb-8">
            <Mic className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Voice Interview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Our AI recruiter will conduct a professional interview via voice.
            Speak clearly and naturally. No text input required.
          </p>

          {error && (
            <div className="mb-6 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {navState.job_title && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wide mb-1">
                Position
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {navState.job_title}
              </p>
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-base font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Radio className="h-5 w-5" />
                Begin Session
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── Completion Modal ───
  if (finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl mx-4">
          <div className="h-20 w-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Interview Completed!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Duration: {formatTime(elapsed)}
          </p>
          {performance?.final_score != null && (
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-6">
              Score: {performance.final_score}/100
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </button>
            <button
              onClick={() =>
                navigate(`/dashboard/feedback?interviewId=${interviewId}`)
              }
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold transition-all hover:from-indigo-500 hover:to-violet-500"
            >
              <BarChart3 className="h-4 w-4" />
              See Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Live Session ───
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 min-h-screen">
      {/* Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Live Session
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
          <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-mono text-slate-700 dark:text-slate-300 tabular-nums">
            {formatTime(elapsed)}
          </span>
        </div>
      </header>

      {/* Audio Stage */}
      <div className="flex-shrink-0 px-6 py-8">
        <div className="flex items-center justify-center gap-12 lg:gap-20">
          {/* AI Recruiter */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-indigo-900/50 to-violet-900/50 border border-indigo-500/30 flex items-center justify-center">
              {aiPlaying && (
                <div className="absolute inset-0 rounded-full animate-pulse bg-indigo-500/10" />
              )}
              <Bot className="h-12 w-12 text-indigo-400" />
            </div>
            <AIWaveVisualizer active={aiPlaying} />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              AI Recruiter
            </span>
          </div>

          {/* Candidate */}
          <div className="flex flex-col items-center gap-4">
            <CandidateRing recording={recording} />
            <div className="h-16 flex items-center">
              {recording ? (
                <span className="text-xs font-semibold text-emerald-400 animate-pulse">
                  Recording...
                </span>
              ) : submitting ? (
                <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
              ) : (
                <span className="text-xs text-slate-600">Ready</span>
              )}
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              You
            </span>
          </div>
        </div>
      </div>

      {/* Mic Button */}
      <div className="flex justify-center pb-6">
        <button
          onClick={toggleMic}
          disabled={micDisabled}
          className={`relative h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            micDisabled
              ? "bg-slate-800 border border-slate-700 cursor-not-allowed opacity-50"
              : recording
                ? "bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-110"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_25px_rgba(99,102,241,0.3)]"
          }`}
          title={
            micDisabled
              ? "Wait for AI to finish speaking"
              : recording
                ? "Stop recording"
                : "Start recording"
          }
        >
          {recording ? (
            <MicOff className="h-7 w-7 text-white" />
          ) : (
            <Mic className="h-7 w-7 text-white" />
          )}
          {recording && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-ping" />
          )}
        </button>
      </div>

      {micDisabled && !submitting && (
        <p className="text-center text-xs text-slate-500 -mt-3 mb-4">
          Mic locked while AI is speaking
        </p>
      )}

      {error && (
        <div className="mx-6 mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Transcript Feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
        {transcript.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "candidate" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "ai"
                  ? "bg-indigo-500/10 border border-indigo-500/30"
                  : "bg-emerald-500/10 border border-emerald-500/30"
              }`}
            >
              {msg.role === "ai" ? (
                <Bot className="h-4 w-4 text-indigo-400" />
              ) : (
                <User className="h-4 w-4 text-emerald-400" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === "ai"
                  ? "bg-slate-800/60 border border-slate-700/50"
                  : "bg-indigo-600/10 border border-indigo-500/20"
              }`}
            >
              <p className="text-sm text-slate-300 leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {submitting && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

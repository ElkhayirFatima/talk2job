import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Send,
  Clock,
  MessageSquare,
  Volume2,
  Type,
  Loader2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { startInterview, submitAnswer } from "../../api/matching";

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function AudioWave({ active }) {
  return (
    <div className="flex items-end gap-1 h-12 justify-center">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all ${
            active
              ? "bg-rose-500 dark:bg-rose-400"
              : "bg-slate-600 dark:bg-slate-700"
          }`}
          style={{
            height: active
              ? `${Math.random() * 100}%`
              : `${12 + Math.random() * 20}%`,
            animationName: active ? "audioBar" : "none",
            animationDuration: `${0.3 + Math.random() * 0.5}s`,
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationTimingFunction: "ease-in-out",
          }}
        />
      ))}
      <style>{`
        @keyframes audioBar {
          0% { height: 15%; }
          100% { height: ${60 + Math.random() * 40}%; }
        }
      `}</style>
    </div>
  );
}

export default function InterviewSimulator() {
  const navigate = useNavigate();
  const textRef = useRef(null);
  const [mode, setMode] = useState("text"); // "text" | "audio"
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [totalQ, setTotalQ] = useState(5);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  // Timer
  useEffect(() => {
    if (!started || finished || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, finished, timeLeft]);

  // Auto-focus text input
  useEffect(() => {
    if (mode === "text" && started && textRef.current) {
      textRef.current.focus();
    }
  }, [mode, started, currentQ]);

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const resumeId = localStorage.getItem("resumeId");
      const res = await startInterview({
        resume_id: resumeId ?? undefined,
        num_questions: 5,
      });
      const data = res.data;
      setSessionId(data.session_id ?? data.id);
      const qs = data.questions ?? [data.question ?? "Tell me about yourself."];
      setQuestions(qs);
      setTotalQ(qs.length || 5);
      setCurrentQ(0);
      setTimeLeft((qs.length || 5) * 120); // 2 min per question
      setStarted(true);
    } catch {
      setError("Failed to start interview session.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() && mode === "text") return;
    setSubmitting(true);
    setError("");

    try {
      const res = await submitAnswer(sessionId, {
        question_index: currentQ,
        answer: answer.trim(),
        mode,
      });

      // If backend returns next question or updated questions list
      if (res.data?.next_question) {
        setQuestions((prev) => [...prev, res.data.next_question]);
      }

      if (currentQ + 1 >= totalQ) {
        setFinished(true);
      } else {
        setCurrentQ((prev) => prev + 1);
        setAnswer("");
      }
    } catch {
      setError("Failed to submit answer. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRecording = useCallback(() => {
    setRecording((prev) => !prev);
    // In a full implementation, this would use the Web Audio API / MediaRecorder
  }, []);

  // Finished → redirect to feedback
  useEffect(() => {
    if (finished && sessionId) {
      const timer = setTimeout(() => {
        navigate(`/dashboard/feedback?sessionId=${sessionId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [finished, sessionId, navigate]);

  // Pre-start screen
  if (!started) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-6">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-rose-600/10 flex items-center justify-center mb-6">
            <Mic className="h-10 w-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            AI Interview Simulator
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            Practice with our AI interviewer. Choose text or voice mode. You'll
            get real-time questions tailored to your profile.
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setMode("text")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                mode === "text"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Type className="h-4 w-4" />
              Text Mode
            </button>
            <button
              onClick={() => setMode("audio")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                mode === "audio"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Volume2 className="h-4 w-4" />
              Audio Mode
            </button>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Start Interview
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Finished screen
  if (finished) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-6">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Interview Complete
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Generating your detailed feedback report...
          </p>
          <Loader2 className="h-6 w-6 text-rose-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const currentQuestion =
    questions[currentQ] ??
    (typeof questions[0] === "object" ? questions[0]?.text : questions[0]) ??
    "Loading question...";

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock className="h-4 w-4" />
            <span
              className={`font-mono font-bold ${
                timeLeft < 60
                  ? "text-red-400"
                  : timeLeft < 120
                    ? "text-amber-400"
                    : "text-emerald-400"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium text-white">
            Question {currentQ + 1}
          </span>
          <span>of {totalQ}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("text")}
            className={`p-2 rounded-lg transition-colors ${
              mode === "text"
                ? "bg-rose-600/20 text-rose-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Type className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMode("audio")}
            className={`p-2 rounded-lg transition-colors ${
              mode === "audio"
                ? "bg-rose-600/20 text-rose-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Center — Question bubble */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <span className="text-xs font-medium text-slate-500">
                Interviewer
              </span>
            </div>
            <p className="text-lg text-slate-200 leading-relaxed font-medium">
              {typeof currentQuestion === "object"
                ? (currentQuestion.text ?? JSON.stringify(currentQuestion))
                : currentQuestion}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-3 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Bottom controls */}
      <div className="border-t border-slate-800 px-6 py-5">
        {mode === "text" ? (
          <div className="flex items-end gap-3 max-w-2xl mx-auto">
            <textarea
              ref={textRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitAnswer();
                }
              }}
              placeholder="Type your answer..."
              rows={3}
              className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900 text-white text-sm px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-colors"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || !answer.trim()}
              className="h-12 w-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <AudioWave active={recording} />
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={toggleRecording}
                className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
                  recording
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 animate-pulse"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-400"
                }`}
              >
                {recording ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </button>
              {recording && (
                <button
                  onClick={() => {
                    setRecording(false);
                    handleSubmitAnswer();
                  }}
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Submit
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-center text-xs text-slate-500 mt-3">
              {recording
                ? "Recording... Click the red button to stop."
                : "Click the microphone to start recording."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

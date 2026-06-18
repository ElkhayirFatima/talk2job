import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  BarChart3,
  Loader2,
  AlertCircle,
  Bot,
  User,
  RotateCcw,
  Mic,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import {
  getAllInterviews,
  getInterview,
  getInterviewMessages,
  getInterviewFeedbacks,
} from "../../api/interview";
import useAuth from "../../hooks/useAuth";

// Rate → Tailwind classes mapping (light / dark)
const RATE_STYLES = {
  H: "border-2 border-red-500 bg-red-50 text-red-900 dark:bg-red-950/20 dark:text-red-200",
  M: "border-2 border-orange-500 bg-orange-50 text-orange-900 dark:bg-orange-950/20 dark:text-orange-200",
  S: "border-2 border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950/20 dark:text-yellow-200",
  R: "border-2 border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-200",
};

const RATE_LABELS = {
  H: "Needs Major Improvement",
  M: "Moderate Concern",
  S: "Minor Issue",
  R: "Strong Response",
};

const RATE_ICON_COLORS = {
  H: "text-red-500 dark:text-red-400",
  M: "text-orange-500 dark:text-orange-400",
  S: "text-yellow-500 dark:text-yellow-400",
  R: "text-emerald-500 dark:text-emerald-400",
};

function ScoreCircle({ score, max = 100 }) {
  const pct = Math.min((score / max) * 100, 100);
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const color =
    pct >= 75
      ? "stroke-emerald-500"
      : pct >= 50
        ? "stroke-amber-500"
        : "stroke-rose-500";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        className="-rotate-90"
      >
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-800"
          strokeWidth="10"
        />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          className={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
          {Math.round(pct)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          / 100
        </span>
      </div>
    </div>
  );
}

function SessionCard({ session, onClick }) {
  const scoreColor =
    (session.score ?? 0) >= 75
      ? "text-emerald-600 dark:text-emerald-400"
      : (session.score ?? 0) >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors text-left group"
    >
      <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center shrink-0">
        <Mic className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {session.job_title || `Interview #${session.id}`}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-xs font-bold ${scoreColor}`}>
            {session.score != null ? `${session.score}/100` : "—"}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
            {session.status}
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 transition-colors shrink-0" />
    </button>
  );
}

export default function InterviewFeedbackReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { auth } = useAuth();

  // Session list state
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Detail state
  const [interview, setInterview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      setSessionsLoading(true);
      try {
        const res = await getAllInterviews();
        const list = Array.isArray(res.data) ? res.data : [];
        const userId = auth?.userId;
        const filtered = userId
          ? list.filter((s) => String(s.user_id) === String(userId))
          : list;
        setSessions(filtered.length > 0 ? filtered : list);
      } catch {
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };
    loadSessions();
  }, [auth?.userId]);

  // Load specific interview detail
  useEffect(() => {
    if (!interviewId) {
      setInterview(null);
      setMessages([]);
      setFeedbacks([]);
      return;
    }
    const loadDetail = async () => {
      setDetailLoading(true);
      setError("");
      try {
        const [interviewRes, messagesRes, feedbacksRes] = await Promise.all([
          getInterview(interviewId),
          getInterviewMessages(interviewId),
          getInterviewFeedbacks(interviewId),
        ]);
        setInterview(interviewRes.data);
        setMessages(Array.isArray(messagesRes.data) ? messagesRes.data : []);
        setFeedbacks(Array.isArray(feedbacksRes.data) ? feedbacksRes.data : []);
      } catch {
        setError("Failed to load feedback data.");
      } finally {
        setDetailLoading(false);
      }
    };
    loadDetail();
  }, [interviewId]);

  const selectSession = (id) => {
    setSearchParams({ interviewId: String(id) });
  };

  const backToList = () => {
    setSearchParams({});
  };

  // ─── Loading ───
  if (sessionsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // ─── Session List View ───
  if (!interviewId) {
    return (
      <div className="p-6 lg:p-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
              Interview History
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review your past interview sessions and performance analytics.
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mb-6">
              <Mic className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Sessions Yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              Complete a voice interview to see your performance analysis here.
            </p>
            <Link
              to="/dashboard/interview"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold transition-all hover:from-indigo-500 hover:to-violet-500"
            >
              <Mic className="h-4 w-4" />
              Start Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => selectSession(session.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Detail Loading ───
  if (detailLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // ─── Error ───
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      </div>
    );
  }

  // ─── Detail View ───
  const score = interview?.score ?? 0;

  const feedbackByMessageId = {};
  feedbacks.forEach((fb) => {
    if (fb.response_id) {
      feedbackByMessageId[fb.response_id] = fb;
    }
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <button
          onClick={backToList}
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Sessions
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Interview Performance
          </h1>
          {interview?.job_title && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Position: {interview.job_title}
            </p>
          )}
        </div>

        {/* Score Section */}
        <div className="flex flex-col items-center mb-12">
          <ScoreCircle score={score} />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Overall Performance Score
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500">75+ Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-500">50-74 Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="text-xs text-slate-500">&lt;50 Needs Work</span>
            </div>
          </div>
        </div>

        {/* Rate Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {Object.entries(RATE_LABELS).map(([key, label]) => (
            <div
              key={key}
              className={`rounded-lg px-3 py-2 text-center ${RATE_STYLES[key]}`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Transcript Review */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Transcript & Analysis
          </h3>

          <div className="space-y-4">
            {messages.map((msg, i) => {
              const isCandidate =
                msg.role === "candidate" || msg.role === "user";
              const feedback = isCandidate ? feedbackByMessageId[msg.id] : null;
              const rateClass = feedback?.rate
                ? (RATE_STYLES[feedback.rate] ?? "")
                : "";

              return (
                <div key={msg.id ?? i} className="space-y-2">
                  {/* Message bubble */}
                  <div
                    className={`flex gap-3 ${isCandidate ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCandidate
                          ? "bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30"
                          : "bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30"
                      }`}
                    >
                      {isCandidate ? (
                        <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        isCandidate
                          ? rateClass ||
                            "bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-300"
                          : "bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 text-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>

                  {/* Feedback judgment block */}
                  {feedback && (
                    <div className={`ml-11 rounded-xl px-4 py-3 ${rateClass}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <BarChart3
                          className={`h-3.5 w-3.5 ${RATE_ICON_COLORS[feedback.rate] ?? "text-slate-400"}`}
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                          {RATE_LABELS[feedback.rate] ?? "Evaluation"}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">
                        {feedback.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Link
            to="/dashboard/interview"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold transition-all hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Link>
          <button
            onClick={backToList}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            All Sessions
          </button>
        </div>
      </div>
    </div>
  );
}

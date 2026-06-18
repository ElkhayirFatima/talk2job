import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Target,
  Sparkles,
  RotateCcw,
  Briefcase,
  TrendingUp,
  Star,
} from "lucide-react";
import { getInterviewFeedback, getParsedResume } from "../../api/matching";

function ScoreBar({ label, score, max = 10 }) {
  const pct = (score / max) * 100;
  const color =
    pct >= 75
      ? "bg-emerald-500 dark:bg-emerald-400"
      : pct >= 50
        ? "bg-amber-500 dark:bg-amber-400"
        : "bg-rose-500 dark:bg-rose-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {score}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function FeedbackCard({ icon: Icon, title, items, accent }) {
  const colors = {
    green:
      "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-500/5",
    red: "border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-500/5",
    blue: "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-500/5",
  };

  const iconColors = {
    green: "text-emerald-600 dark:text-emerald-400",
    red: "text-rose-600 dark:text-rose-400",
    blue: "text-blue-600 dark:text-blue-400",
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[accent]}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 ${iconColors[accent]}`} />
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h4>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
            >
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0 opacity-40" />
              {typeof item === "string"
                ? item
                : (item.text ?? JSON.stringify(item))}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500 italic">
          No items to display.
        </p>
      )}
    </div>
  );
}

function SkillGapRow({ skill, has, needed }) {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">
        {skill}
      </span>
      <div className="flex items-center gap-1">
        {has ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        )}
        <span
          className={`text-xs font-medium ${
            has
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {has ? "You have" : "Missing"}
        </span>
      </div>
      {needed && !has && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Required
        </span>
      )}
    </div>
  );
}

export default function FeedbackReport() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [feedback, setFeedback] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (sessionId) {
          const res = await getInterviewFeedback(sessionId);
          setFeedback(res.data);
        }
        const resumeId = localStorage.getItem("resumeId");
        if (resumeId) {
          const resumeRes = await getParsedResume(resumeId).catch(() => null);
          if (resumeRes) setResume(resumeRes.data);
        }
      } catch {
        setError("Failed to load feedback data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  // Normalize feedback data
  const overallScore = feedback?.overall_score ?? feedback?.score ?? null;
  const strengths = feedback?.strengths ?? [];
  const weaknesses = feedback?.weaknesses ?? feedback?.areas_to_improve ?? [];
  const suggestions = feedback?.suggestions ?? feedback?.recommendations ?? [];
  const categoryScores = feedback?.category_scores ?? feedback?.scores ?? {};
  const skillGaps = feedback?.skill_gaps ?? [];

  // Build skill gap comparison from resume vs feedback
  const resumeSkills = resume?.skills ?? resume?.extracted_skills ?? [];
  const requiredSkills =
    feedback?.required_skills ?? feedback?.target_skills ?? [];
  const resumeSkillSet = new Set(
    resumeSkills.map((s) =>
      (typeof s === "string" ? s : (s.name ?? "")).toLowerCase(),
    ),
  );

  const gapComparison =
    skillGaps.length > 0
      ? skillGaps
      : requiredSkills.map((s) => {
          const name = typeof s === "string" ? s : (s.name ?? s);
          return {
            skill: name,
            has: resumeSkillSet.has(name.toLowerCase()),
            needed: true,
          };
        });

  // No feedback — empty state
  if (!feedback && !sessionId) {
    return (
      <div className="p-6 lg:p-10">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Feedback & Analysis
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Complete an interview session to see your results here.
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <BarChart3 className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Feedback Yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Start an AI interview simulation to receive detailed performance
            analytics and skill gap analysis.
          </p>
          <Link
            to="/dashboard/interview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
          >
            Start Interview <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
              Interview Feedback
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your performance analysis and skill gap report.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Overall score hero */}
      {overallScore !== null && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Score ring */}
            <div className="relative h-28 w-28 shrink-0">
              <svg className="-rotate-90 h-28 w-28" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  className="stroke-slate-200 dark:stroke-slate-700"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  className={
                    overallScore >= 75
                      ? "stroke-emerald-500 dark:stroke-emerald-400"
                      : overallScore >= 50
                        ? "stroke-amber-500 dark:stroke-amber-400"
                        : "stroke-rose-500 dark:stroke-rose-400"
                  }
                  strokeWidth="8"
                  strokeDasharray={`${(overallScore / 100) * 264} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {typeof overallScore === "number"
                    ? overallScore > 1
                      ? overallScore.toFixed(0)
                      : (overallScore * 100).toFixed(0)
                    : overallScore}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Score
                </span>
              </div>
            </div>

            {/* Category scores */}
            <div className="flex-1 w-full space-y-3">
              {Object.entries(categoryScores).length > 0 ? (
                Object.entries(categoryScores).map(([key, val]) => (
                  <ScoreBar
                    key={key}
                    label={key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    score={
                      typeof val === "number" ? (val > 10 ? val / 10 : val) : 0
                    }
                  />
                ))
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Star className="h-4 w-4" />
                  Overall performance score based on AI evaluation.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FeedbackCard
          icon={ThumbsUp}
          title="Strengths"
          items={strengths}
          accent="green"
        />
        <FeedbackCard
          icon={ThumbsDown}
          title="Areas to Improve"
          items={weaknesses}
          accent="red"
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <FeedbackCard
            icon={TrendingUp}
            title="Recommendations"
            items={suggestions}
            accent="blue"
          />
        </div>
      )}

      {/* Skill Gap Analysis */}
      {gapComparison.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Target className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Skill Gap Analysis
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Comparing your resume skills against target job profile
            requirements.
          </p>
          <div>
            {gapComparison.map((g, i) => (
              <SkillGapRow
                key={i}
                skill={g.skill ?? g.name ?? g}
                has={g.has ?? g.present ?? false}
                needed={g.needed ?? g.required ?? true}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/dashboard/interview"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Retry Interview
        </Link>
        <Link
          to="/dashboard/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
        >
          <Briefcase className="h-4 w-4" />
          View Top Matches
        </Link>
      </div>
    </div>
  );
}

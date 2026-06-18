import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Upload,
  BarChart3,
  Loader2,
  X,
} from "lucide-react";
import {
  getParsedResume,
  recommendMatches,
  getUserResumes,
  activateResume,
} from "../../api/matching";
import useAuth from "../../hooks/useAuth";
import ResumeSelector from "./ResumeSelector";
import ProfileHeader from "./ProfileHeader";

function StatCard({ icon: Icon, label, value, accent }) {
  const colors = {
    rose: "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
    emerald:
      "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber:
      "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center ${colors[accent]}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function SkillBadge({ skill }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      {skill}
    </span>
  );
}

export default function DashboardOverview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const paramResumeId = searchParams.get("resumeId");

  // Multi-resume state
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(
    paramResumeId || localStorage.getItem("resumeId") || "",
  );
  const [resumeSwitching, setResumeSwitching] = useState(false);

  const [resume, setResume] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Persist resumeId from URL to localStorage
  useEffect(() => {
    if (paramResumeId) {
      localStorage.setItem("resumeId", paramResumeId);
      setActiveResumeId(paramResumeId);
    }
  }, [paramResumeId]);

  // Fetch all user resumes on mount
  useEffect(() => {
    if (!auth?.userId) return;
    getUserResumes(auth.userId)
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : (res.data?.resumes ?? []);
        setResumes(list);

        // Determine initial active resume:
        // 1. URL param or localStorage, 2. DB is_active flag, 3. first item
        if (!activeResumeId && list.length > 0) {
          const dbActive = list.find((r) => r.is_active === true);
          const pick = dbActive ?? list[0];
          const pickId = String(pick.id ?? pick._id);
          setActiveResumeId(pickId);
          localStorage.setItem("resumeId", pickId);
        }
      })
      .catch(() => {});
  }, [auth?.userId]);

  // Load active resume data + matches
  useEffect(() => {
    if (!activeResumeId) return;

    const load = async () => {
      setLoading(true);
      try {
        const [resumeRes, matchRes] = await Promise.all([
          getParsedResume(activeResumeId),
          recommendMatches(activeResumeId).catch(() => ({ data: [] })),
        ]);
        setResume(resumeRes.data);
        const matchData = matchRes.data;
        const matchList = Array.isArray(matchData)
          ? matchData.slice(0, 3)
          : (matchData?.recommendations?.slice(0, 3) ??
            matchData?.matches?.slice(0, 3) ??
            []);
        setMatches(matchList);
      } catch {
        setError("Failed to load resume data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeResumeId]);

  // Handle CV activation switch
  const handleActivateResume = async (id) => {
    const previousId = activeResumeId;
    setResumeSwitching(true);
    setError("");
    // Optimistic update
    setActiveResumeId(id);
    localStorage.setItem("resumeId", id);
    try {
      const token = auth?.accessToken;
      await activateResume(id, token);
    } catch (err) {
      // Rollback on failure
      setActiveResumeId(previousId);
      localStorage.setItem("resumeId", previousId);
      const status = err?.response?.status;
      if (status === 404) {
        setError("Resume not found. It may have been deleted.");
      } else if (status === 403) {
        setError("You don't have permission to activate this resume.");
      } else {
        setError("Failed to switch resume. Please try again.");
      }
    } finally {
      setResumeSwitching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  // Empty state — no resume uploaded yet
  if (!activeResumeId && !resume) {
    return (
      <div className="p-6 lg:p-10">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Dashboard
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Welcome back. Upload your CV to get started.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Target} label="Match Score" value="—" accent="rose" />
          <StatCard
            icon={CheckCircle2}
            label="Profile Ready"
            value="—"
            accent="emerald"
          />
          <StatCard
            icon={Briefcase}
            label="Active Matches"
            value="0"
            accent="blue"
          />
          <StatCard
            icon={Clock}
            label="Applications"
            value="0"
            accent="amber"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-5">
            <Upload className="h-8 w-8 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Resume Uploaded
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Upload your CV and our AI will extract your skills, experience, and
            qualifications to find your best job matches.
          </p>
          <Link
            to="/dashboard/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload CV
          </Link>
        </div>
      </div>
    );
  }

  // Parse skills from comma-separated strings returned by backend
  const coreSkillsRaw = resume?.core_skills ?? "";
  const secondarySkillsRaw = resume?.secondary_skills ?? "";
  const skills = [
    ...coreSkillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    ...secondarySkillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ];
  const experience = resume?.experience ?? resume?.work_experience ?? [];
  const education = resume?.education ?? [];
  const cvSummary = resume?.cv_summary ?? "";
  const seniorityLevel = resume?.seniority_level ?? "";
  const profileReadiness =
    skills.length > 0 ? Math.min(100, skills.length * 8 + 20) : 0;
  const topMatchScore =
    matches[0]?.ranking_score ??
    matches[0]?.score ??
    matches[0]?.match_score ??
    null;

  return (
    <div className="p-6 lg:p-10">
      {/* Profile Header */}
      <ProfileHeader user={auth?.user} resume={resume} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h2>
            {/* Resume Selector */}
            {resumes.length > 1 && (
              <ResumeSelector
                resumes={resumes}
                activeResumeId={activeResumeId}
                onActivate={handleActivateResume}
                loading={resumeSwitching}
              />
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your resume has been analyzed. Here's your profile overview.
          </p>
        </div>
        <Link
          to="/dashboard/jobs"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
        >
          View Matches <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Target}
          label="Top Match"
          value={
            topMatchScore
              ? `${topMatchScore > 1 ? topMatchScore.toFixed(1) : (topMatchScore * 100).toFixed(1)}%`
              : "—"
          }
          accent="rose"
        />
        <StatCard
          icon={CheckCircle2}
          label="Profile Ready"
          value={`${profileReadiness}%`}
          accent="emerald"
        />
        <StatCard
          icon={Briefcase}
          label="Active Matches"
          value={matches.length}
          accent="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Skills Found"
          value={skills.length}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CV Analysis Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              CV Analysis
            </h3>
          </div>

          {/* Summary */}
          {cvSummary && (
            <div className="mb-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Summary
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {cvSummary}
              </p>
            </div>
          )}

          {/* Seniority Level */}
          {seniorityLevel && (
            <div className="mb-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Seniority Level
              </p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20">
                {seniorityLevel}
              </span>
            </div>
          )}

          {/* Skills */}
          <div className="mb-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Extracted Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.length > 0 ? (
                skills
                  .slice(0, 15)
                  .map((s, i) => (
                    <SkillBadge
                      key={i}
                      skill={typeof s === "string" ? s : (s.name ?? s)}
                    />
                  ))
              ) : (
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  No skills extracted
                </span>
              )}
              {skills.length > 15 && (
                <button
                  onClick={() => setShowAllSkills(true)}
                  className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 self-center ml-1 cursor-pointer transition-colors"
                >
                  +{skills.length - 15} more
                </button>
              )}
            </div>
          </div>

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Experience
              </p>
              <div className="space-y-2">
                {experience.slice(0, 3).map((exp, i) => (
                  <div
                    key={i}
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                  >
                    <Briefcase className="h-3.5 w-3.5 mt-0.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>
                      {typeof exp === "string"
                        ? exp
                        : `${exp.title ?? exp.position ?? ""} ${exp.company ? `@ ${exp.company}` : ""}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Education
              </p>
              <div className="space-y-1">
                {education.slice(0, 2).map((ed, i) => (
                  <p
                    key={i}
                    className="text-sm text-slate-700 dark:text-slate-300"
                  >
                    {typeof ed === "string"
                      ? ed
                      : `${ed.degree ?? ""} ${ed.institution ? `— ${ed.institution}` : ""}`}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Matches Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Top Matches
              </h3>
            </div>
            <Link
              to="/dashboard/jobs"
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
            >
              View all →
            </Link>
          </div>

          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((m, i) => {
                const rawScore =
                  m.ranking_score ?? m.score ?? m.match_score ?? 0;
                const score = rawScore > 1 ? rawScore / 100 : rawScore;
                const title = m.title ?? m.job_title ?? "Job Position";
                const company = m.company ?? m.company_name ?? "";
                const jobId = m.job_id ?? m.id;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    {/* Score ring */}
                    <div className="relative h-12 w-12 shrink-0">
                      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          className="stroke-slate-200 dark:stroke-slate-700"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.5"
                          fill="none"
                          className="stroke-rose-500 dark:stroke-rose-400"
                          strokeWidth="3"
                          strokeDasharray={`${score * 97.4} 97.4`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-900 dark:text-white">
                        {(score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {title}
                      </p>
                      {company && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {company}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        navigate("/dashboard/jobs", {
                          state: { focusJobId: jobId },
                        })
                      }
                      className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                      aria-label={`View ${title}`}
                    >
                      <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Match recommendations will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Skills Modal */}
      {showAllSkills && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAllSkills(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-lg max-h-[70vh] overflow-y-auto shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                All Extracted Skills ({skills.length})
              </h3>
              <button
                onClick={() => setShowAllSkills(false)}
                className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <SkillBadge
                  key={i}
                  skill={typeof s === "string" ? s : (s.name ?? s)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

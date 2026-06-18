import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  Filter,
  Loader2,
  AlertCircle,
  Briefcase,
  ChevronDown,
  X,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Calendar,
  Zap,
  MessageSquare,
  Target,
  Mic,
} from "lucide-react";
import {
  getJobs,
  getCompanies,
  recommendMatches,
  directMatch,
} from "../../api/matching";
import useAuth from "../../hooks/useAuth";

function MatchRing({ score, size = 56 }) {
  const pct = score * 100;
  const r = size === 56 ? 22 : 15.5;
  const circ = 2 * Math.PI * r;
  const viewBox = size === 56 ? "0 0 52 52" : "0 0 36 36";
  const cx = size === 56 ? 26 : 18;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        className="-rotate-90"
        style={{ width: size, height: size }}
        viewBox={viewBox}
      >
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="3.5"
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          className={
            pct >= 80
              ? "stroke-emerald-500 dark:stroke-emerald-400"
              : pct >= 60
                ? "stroke-amber-500 dark:stroke-amber-400"
                : "stroke-rose-500 dark:stroke-rose-400"
          }
          strokeWidth="3.5"
          strokeDasharray={`${(score * circ).toFixed(1)} ${circ.toFixed(1)}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white">
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

function TechBadge({ tech }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
      {tech}
    </span>
  );
}

function JobCard({ job, matchScore, recommendation, focused, cardRef }) {
  const [expanded, setExpanded] = useState(focused ?? false);
  const [glowing, setGlowing] = useState(focused ?? false);
  const [directMatchResult, setDirectMatchResult] = useState(null);
  const [directMatchLoading, setDirectMatchLoading] = useState(false);
  const [directMatchError, setDirectMatchError] = useState("");
  const { auth } = useAuth();
  const navigate = useNavigate();
  const title = job.title ?? job.job_title ?? "Position";
  const company = job.company ?? job.company_name ?? "";
  const location = job.location ?? "";
  const techs = job.tech_stack ?? job.skills ?? job.required_skills ?? [];
  const type = job.job_type ?? job.type ?? "";
  const score = matchScore ?? job.match_score ?? job.score ?? null;

  // Job-level fields (always available from the listing payload)
  const jobSummary = job.summary ?? "";
  const jobSeniority = job.seniority_level ?? "";
  const jobUrl = job.job_url ?? job.url ?? "";
  const jobPostedAt = job.posted_at ?? "";

  // Recommendation-level fields (only after match computation)
  const difficultyLevel = recommendation?.difficulty_level ?? "";
  const insightMessage = recommendation?.insight_message ?? "";
  const recSummary = recommendation?.summary ?? "";

  const hasExistingMatch = score !== null || !!recommendation;

  // Remove glow after animation
  useEffect(() => {
    if (glowing) {
      const timer = setTimeout(() => setGlowing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [glowing]);

  const handleDirectMatch = async () => {
    const resumeId = localStorage.getItem("resumeId");
    if (!resumeId) {
      setDirectMatchError("No active resume. Upload a CV first.");
      return;
    }
    const jobId = job.id ?? job._id;
    if (!jobId) return;
    setDirectMatchLoading(true);
    setDirectMatchError("");
    try {
      const token = auth?.accessToken;
      const res = await directMatch(jobId, resumeId, token);
      setDirectMatchResult(res.data);
    } catch {
      setDirectMatchError("Match evaluation failed. Try again.");
    } finally {
      setDirectMatchLoading(false);
    }
  };

  const dmScore =
    directMatchResult?.ranking_score ??
    directMatchResult?.score ??
    directMatchResult?.match_score ??
    null;
  const dmInsight = directMatchResult?.insight_message ?? "";
  const dmSummary = directMatchResult?.summary ?? "";

  const difficultyColor = {
    "Ideal Match":
      "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20",
    Challenging:
      "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20",
    Overqualified:
      "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20",
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors group ${glowing ? "ring-2 ring-rose-500/60 dark:ring-rose-400/60 animate-pulse" : ""}`}
    >
      <div className="flex items-start gap-4">
        {/* Company icon */}
        <div className="h-11 w-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-sm font-bold text-slate-500 dark:text-slate-400">
          {company ? company.charAt(0).toUpperCase() : "?"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {title}
              </h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                {company && (
                  <span className="flex items-center gap-1 truncate">
                    <Building2 className="h-3 w-3" />
                    {company}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3" />
                    {location}
                  </span>
                )}
              </div>
            </div>

            {/* Match ring */}
            {score !== null && (
              <MatchRing score={score > 1 ? score / 100 : score} />
            )}
          </div>

          {/* Tech stack */}
          {techs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {techs.slice(0, 6).map((t, i) => (
                <TechBadge
                  key={i}
                  tech={typeof t === "string" ? t : (t.name ?? t)}
                />
              ))}
              {techs.length > 6 && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 self-center ml-1">
                  +{techs.length - 6}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4">
            {type && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {type}
              </span>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 transition-opacity"
            >
              {expanded ? "Hide Details" : "View Details"}{" "}
              <ArrowRight
                className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </button>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {/* ── Job-Level Details (always visible) ── */}

              {/* Job Summary */}
              {jobSummary && (
                <div className="flex items-start gap-2">
                  <Briefcase className="h-3.5 w-3.5 mt-0.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {jobSummary}
                  </p>
                </div>
              )}

              {/* Seniority Target */}
              {jobSeniority && (
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Seniority:
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                    {jobSeniority}
                  </span>
                </div>
              )}

              {/* Posted At & External Link */}
              <div className="flex items-center gap-4">
                {jobPostedAt && jobPostedAt !== "N/A" && (
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {jobPostedAt}
                  </span>
                )}
                {jobUrl && jobUrl !== "#" && (
                  <a
                    href={jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Original
                  </a>
                )}
              </div>

              {/* ── Match-Level Details (only when recommendation exists) ── */}
              {recommendation && (
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {/* Difficulty Level */}
                  {difficultyLevel && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Difficulty:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${difficultyColor[difficultyLevel] ?? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                      >
                        {difficultyLevel}
                      </span>
                    </div>
                  )}

                  {/* Insight Message */}
                  {insightMessage && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {insightMessage}
                      </p>
                    </div>
                  )}

                  {/* Recommendation Summary */}
                  {recSummary && (
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 mt-0.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {recSummary}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Match This Job (only when no existing match score) ── */}
              {!hasExistingMatch && !directMatchResult && (
                <button
                  onClick={handleDirectMatch}
                  disabled={directMatchLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-sm font-semibold transition-all disabled:opacity-60 shadow-sm shadow-rose-500/20"
                >
                  {directMatchLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Evaluating Match...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4" />
                      Match This Job
                    </>
                  )}
                </button>
              )}

              {directMatchError && (
                <p className="text-xs text-red-500 dark:text-red-400 text-center">
                  {directMatchError}
                </p>
              )}

              {/* Direct Match Result Panel */}
              {directMatchResult && (
                <div className="mt-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                    <Target className="h-3.5 w-3.5" />
                    AI Match Analysis
                  </div>

                  {/* Score Ring */}
                  {dmScore !== null && (
                    <div className="flex items-center gap-4">
                      <MatchRing
                        score={dmScore > 1 ? dmScore / 100 : dmScore}
                        size={56}
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Compatibility Score
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(dmScore > 1 ? dmScore : dmScore * 100).toFixed(1)}%
                          match with your active profile
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Insight */}
                  {dmInsight && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        AI Insight
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {dmInsight}
                      </p>
                    </div>
                  )}

                  {/* Summary */}
                  {dmSummary && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                        Job Summary
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {dmSummary}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Simulate Interview Button ── */}
              <button
                onClick={() => {
                  const resumeId = localStorage.getItem("resumeId");
                  navigate("/dashboard/interview", {
                    state: {
                      job_id: String(job.id ?? job._id ?? 0),
                      job_title: title,
                      resume_id: resumeId ?? "",
                      user_id: auth?.userId ?? "",
                    },
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-500/20"
              >
                <Mic className="h-4 w-4" />
                Simulate Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobMatchingFeed() {
  const location = useLocation();
  const focusJobId = location.state?.focusJobId
    ? String(location.state.focusJobId)
    : null;
  const focusRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [matchScores, setMatchScores] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Scroll to focused job card after render
  useEffect(() => {
    if (focusJobId && !loading && focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusJobId, loading]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [jobsRes, companiesRes] = await Promise.all([
          getJobs(),
          getCompanies().catch(() => ({ data: [] })),
        ]);
        const jobList = Array.isArray(jobsRes.data)
          ? jobsRes.data
          : (jobsRes.data?.jobs ?? []);
        const compList = Array.isArray(companiesRes.data)
          ? companiesRes.data
          : (companiesRes.data?.companies ?? []);
        setCompanies(compList);

        // Try loading match scores from localStorage resumeId
        const resumeId =
          new URLSearchParams(window.location.search).get("resumeId") ||
          localStorage.getItem("resumeId");
        if (resumeId) {
          try {
            const matchRes = await recommendMatches(resumeId);
            const matchData = matchRes.data;
            const matchList = Array.isArray(matchData)
              ? matchData
              : (matchData?.recommendations ?? matchData?.matches ?? []);
            const scores = {};
            const recsMap = {};
            matchList.forEach((m) => {
              const id = m.job_id ?? m.id;
              const rawScore = m.ranking_score ?? m.score ?? m.match_score ?? 0;
              if (id) {
                scores[id] = rawScore > 1 ? rawScore / 100 : rawScore;
                recsMap[id] = m;
              }
            });
            setMatchScores(scores);
            setRecommendations(recsMap);

            // Merge: use jobs from getJobs(), but also include recommendation-only entries
            const jobMap = new Map();
            jobList.forEach((j) => jobMap.set(String(j.id ?? j._id), j));
            matchList.forEach((m) => {
              const id = String(m.job_id ?? m.id);
              if (!jobMap.has(id)) {
                // Recommendation-only job not in the jobs list — add it
                jobMap.set(id, {
                  id: id,
                  title: m.title ?? "Position",
                  company: m.company ?? "",
                  location: m.location ?? "",
                  match_score: m.ranking_score ?? 0,
                  job_url: m.job_url ?? "#",
                });
              }
            });
            setJobs(Array.from(jobMap.values()));
          } catch {
            setJobs(jobList);
          }
        } else {
          setJobs(jobList);
        }
      } catch {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const locations = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      const loc = j.location ?? "";
      if (loc) set.add(loc);
    });
    return Array.from(set).sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((j) => {
        const title = (j.title ?? j.job_title ?? "").toLowerCase();
        const comp = (j.company ?? j.company_name ?? "").toLowerCase();
        return title.includes(q) || comp.includes(q);
      });
    }
    if (filterCompany) {
      list = list.filter(
        (j) => (j.company ?? j.company_name ?? "") === filterCompany,
      );
    }
    if (filterLocation) {
      list = list.filter((j) => (j.location ?? "") === filterLocation);
    }
    // Sort by match score descending
    list.sort((a, b) => {
      const sa =
        matchScores[String(a.id ?? a._id)] ?? a.match_score ?? a.score ?? 0;
      const sb =
        matchScores[String(b.id ?? b._id)] ?? b.match_score ?? b.score ?? 0;
      return sb - sa;
    });
    return list;
  }, [jobs, search, filterCompany, filterLocation, matchScores]);

  const hasActiveFilters = filterCompany || filterLocation;

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
            Job Matches
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          AI-powered job recommendations ranked by match score.
        </p>
      </div>

      {/* Search + Filters bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? "border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="h-4 w-4 rounded-full bg-rose-600 text-[10px] text-white flex items-center justify-center font-bold">
                !
              </span>
            )}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Company filter */}
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="">All Companies</option>
              {companies.map((c, i) => (
                <option
                  key={i}
                  value={typeof c === "string" ? c : (c.name ?? c)}
                >
                  {typeof c === "string" ? c : (c.name ?? c)}
                </option>
              ))}
            </select>

            {/* Location filter */}
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="">All Locations</option>
              {locations.map((l, i) => (
                <option key={i} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilterCompany("");
                  setFilterLocation("");
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filtered.map((job, i) => {
              const jobId = String(job.id ?? job._id);
              const isFocused = focusJobId === jobId;
              return (
                <JobCard
                  key={jobId ?? i}
                  job={job}
                  matchScore={matchScores[jobId]}
                  recommendation={recommendations[jobId]}
                  focused={isFocused}
                  cardRef={isFocused ? focusRef : undefined}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <Briefcase className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {search || hasActiveFilters
              ? "No jobs match your filters."
              : "No jobs available yet."}
          </p>
        </div>
      )}
    </div>
  );
}

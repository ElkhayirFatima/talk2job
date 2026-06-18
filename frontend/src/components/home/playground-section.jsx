import { useState } from "react";
import {
  FileText,
  MessageSquare,
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const TABS = [
  { id: "resume", label: "Resume Analyzer", icon: FileText },
  { id: "interview", label: "Interview Simulator", icon: MessageSquare },
  { id: "matcher", label: "Job Matcher", icon: Target },
];

function ResumeTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              john_doe_resume.pdf
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uploaded 2 seconds ago
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800">
          ANALYZED
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700">
          <p className="text-lg font-bold text-slate-900 dark:text-white">87</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Overall Score
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700">
          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            12
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Skills Found
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700">
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            5yr
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Experience
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Key Strengths
        </p>
        {[
          { skill: "React & TypeScript", score: 95, color: "bg-rose-500" },
          { skill: "System Design", score: 82, color: "bg-indigo-500" },
          { skill: "Communication", score: 78, color: "bg-sky-500" },
        ].map((s) => (
          <div key={s.skill} className="flex items-center gap-3">
            <span className="text-xs text-slate-600 dark:text-slate-300 w-32 truncate">
              {s.skill}
            </span>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className={`${s.color} h-1.5 rounded-full transition-all`}
                style={{ width: `${s.score}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">
              {s.score}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-800">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            Skill Gap Detected
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400/80">
            Consider adding cloud infrastructure experience (AWS/GCP)
          </p>
        </div>
      </div>
    </div>
  );
}

function InterviewTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Senior Frontend Engineer — Mock
        </p>
        <span className="px-2.5 py-1 text-[10px] font-bold bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full border border-sky-100 dark:border-sky-800">
          IN PROGRESS
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl rounded-tl-sm p-3 border border-slate-100 dark:border-slate-700 flex-1">
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Can you explain how you would design a real-time collaboration
              system similar to Google Docs?
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl rounded-tr-sm p-3 border border-rose-100 dark:border-rose-800 max-w-[80%]">
            <p className="text-xs text-slate-700 dark:text-slate-300">
              I'd start by using Operational Transformation or CRDTs for
              conflict resolution, WebSockets for real-time sync, and a
              distributed event store for persistence...
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Y
            </span>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            AI Feedback
          </p>
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400/80">
          Strong systems thinking. Consider discussing trade-offs between OT and
          CRDT approaches for bonus points.
        </p>
      </div>
    </div>
  );
}

function MatcherTab() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Top Matches for Your Profile
      </p>
      {[
        {
          title: "Senior Frontend Engineer",
          company: "Vercel",
          match: 96,
          badge: "REMOTE",
          badgeColor:
            "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
        },
        {
          title: "Full Stack Developer",
          company: "Linear",
          match: 91,
          badge: "HYBRID",
          badgeColor:
            "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-800",
        },
        {
          title: "React Engineer",
          company: "Notion",
          match: 88,
          badge: "ON-SITE",
          badgeColor:
            "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
        },
      ].map((job) => (
        <div
          key={job.title}
          className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {job.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {job.company}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {job.match}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mr-3">
              <div
                className="bg-gradient-to-r from-rose-500 to-rose-600 h-1.5 rounded-full"
                style={{ width: `${job.match}%` }}
              />
            </div>
            <span
              className={`px-2 py-0.5 text-[9px] font-bold rounded-md border ${job.badgeColor} flex-shrink-0`}
            >
              {job.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const TAB_CONTENT = {
  resume: ResumeTab,
  interview: InterviewTab,
  matcher: MatcherTab,
};

export default function PlaygroundSection() {
  const [activeTab, setActiveTab] = useState("resume");
  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <section
      id="playground"
      className="py-20 lg:py-28 bg-slate-50/80 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/50"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase">
            AI Playground
          </div>
          <h3 className="font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            Experience the platform{" "}
            <span className="text-rose-600">before you sign up</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Interactive previews of our core AI capabilities. No account
            required.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-1 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-600/50"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50 border border-transparent"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6">
            <ActiveContent />
          </div>
        </div>
      </div>
    </section>
  );
}

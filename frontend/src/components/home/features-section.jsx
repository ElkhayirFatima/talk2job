import {
  FileText,
  BrainCircuit,
  Video,
  Compass,
  Users,
  BarChart3,
  Search,
  Code2,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Analysis",
    description:
      "Our neural network reads between the lines — decoding implicit skills, hidden expertise, and architectural depth beyond simple keywords.",
    badge: "CORE",
    color: {
      icon: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-100 dark:border-rose-800",
      badge:
        "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800",
      hover: "hover:border-rose-300 dark:hover:border-rose-700",
    },
  },
  {
    icon: BrainCircuit,
    title: "Intelligent Job Matching",
    description:
      "Talk2Job maps your professional DNA against live marketplace telemetry, revealing your highest-scoring alignment paths instantly.",
    badge: "AI ENGINE",
    color: {
      icon: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-100 dark:border-indigo-800",
      badge:
        "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
      hover: "hover:border-indigo-300 dark:hover:border-indigo-700",
    },
  },
  {
    icon: Video,
    title: "Interview Simulator",
    description:
      "Engage with generative AI interview agents calibrated to your target role. Behavioral and technical analytics before the real thing.",
    badge: "INTERACTIVE",
    color: {
      icon: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-900/20",
      border: "border-sky-100 dark:border-sky-800",
      badge:
        "bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-800",
      hover: "hover:border-sky-300 dark:hover:border-sky-700",
    },
  },
  {
    icon: Compass,
    title: "Career Path Recommendations",
    description:
      "Get AI-driven career trajectory insights based on your skills, market trends, and growth opportunities across industries.",
    badge: "INSIGHTS",
    color: {
      icon: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-800",
      badge:
        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
      hover: "hover:border-emerald-300 dark:hover:border-emerald-700",
    },
  },
  {
    icon: Users,
    title: "Recruiter Intelligence",
    description:
      "Equip hiring teams with deep candidate telemetry, automated screening, and AI-powered shortlisting for faster, smarter hiring.",
    badge: "ENTERPRISE",
    color: {
      icon: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-800",
      badge:
        "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
      hover: "hover:border-amber-300 dark:hover:border-amber-700",
    },
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track every signal as it changes. Watch your match score improve session-by-session with granular insight into what's moving the needle.",
    badge: "TELEMETRY",
    color: {
      icon: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-100 dark:border-orange-800",
      badge:
        "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800",
      hover: "hover:border-orange-300 dark:hover:border-orange-700",
    },
  },
  {
    icon: Search,
    title: "Skill Gap Detection",
    description:
      "Identify precisely what skills you need to develop to reach your target role with actionable improvement roadmaps.",
    badge: "ANALYSIS",
    color: {
      icon: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-100 dark:border-rose-800",
      badge:
        "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800",
      hover: "hover:border-rose-300 dark:hover:border-rose-700",
    },
  },
  {
    icon: Code2,
    title: "Developer API",
    description:
      "Integrate Talk2Job intelligence into your own platforms with our RESTful API. Full SDK support for Python, Node.js, and .NET.",
    badge: "PLATFORM",
    color: {
      icon: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-100 dark:border-indigo-800",
      badge:
        "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
      hover: "hover:border-indigo-300 dark:hover:border-indigo-700",
    },
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-20 lg:py-28 bg-white dark:bg-slate-950"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase">
            Platform Capabilities
          </div>
          <h3 className="font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            Everything you need to{" "}
            <span className="text-rose-600">accelerate your career</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            A comprehensive suite of AI-powered tools designed for job seekers
            and recruiters alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50
                cursor-pointer transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 ${feature.color.hover}
                group flex flex-col`}
            >
              <div className="flex justify-between items-start mb-5">
                <div
                  className={`p-2.5 rounded-xl border ${feature.color.border} ${feature.color.bg} transition-transform duration-300 group-hover:scale-105`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color.icon}`} />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-md uppercase border ${feature.color.badge}`}
                >
                  {feature.badge}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                {feature.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

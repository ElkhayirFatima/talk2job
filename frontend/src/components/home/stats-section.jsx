import { Users, Target, FileText, Globe, Zap, ShieldCheck } from "lucide-react";

const STATS = [
  {
    value: "1.2M+",
    label: "Interviews Simulated",
    icon: Users,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    value: "94.6%",
    label: "Match Accuracy",
    icon: Target,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    value: "250K+",
    label: "Resumes Processed",
    icon: FileText,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
  },
  {
    value: "65+",
    label: "Countries Served",
    icon: Globe,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    value: "<60s",
    label: "AI Analysis Time",
    icon: Zap,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    value: "99.98%",
    label: "Platform Uptime",
    icon: ShieldCheck,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
];

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="py-16 lg:py-20 bg-slate-50/80 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/50"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Platform Telemetry
          </p>
          <h3 className="font-bold text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white">
            Real-time intelligence at scale
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-5 text-center hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.bg} mb-3`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { User } from "lucide-react";

export default function ProfileHeader({ user, resume }) {
  if (!resume) return null;

  const name = user ?? "User";
  const seniority = resume?.seniority_level ?? "";
  const summary = resume?.cv_summary ?? "";

  const seniorityColors = {
    Junior:
      "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20",
    "Mid-level":
      "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20",
    Senior:
      "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20",
    Lead: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20",
  };

  const pillClass =
    seniorityColors[seniority] ??
    "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/20";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
          <User className="h-8 w-8 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + Seniority */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {name}
            </h2>
            {seniority && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${pillClass}`}
              >
                {seniority}
              </span>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 italic">
              "{summary}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

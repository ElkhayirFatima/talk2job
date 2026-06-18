import { useState, useRef, useEffect } from "react";
import { FileText, ChevronDown, Check, Loader2 } from "lucide-react";

export default function ResumeSelector({
  resumes,
  activeResumeId,
  onActivate,
  loading,
}) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!resumes || resumes.length === 0) return null;

  const active = resumes.find(
    (r) => String(r.id ?? r._id) === String(activeResumeId),
  );
  const activeLabel =
    active?.filename ??
    active?.file_name ??
    active?.original_filename ??
    "Resume";

  const handleSelect = async (resume) => {
    const id = String(resume.id ?? resume._id);
    if (id === String(activeResumeId)) {
      setOpen(false);
      return;
    }
    setSwitching(id);
    try {
      await onActivate(id);
    } finally {
      setSwitching(null);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
      >
        <FileText className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
        <span className="max-w-[180px] truncate">{activeLabel}</span>
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ChevronDown
            className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-72 max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-50 py-1">
          {resumes.map((r) => {
            const id = String(r.id ?? r._id);
            const isActive = id === String(activeResumeId);
            const isSwitching = switching === id;
            const label =
              r.filename ??
              r.file_name ??
              r.original_filename ??
              `Resume ${id}`;
            const seniority = r.seniority_level ?? "";
            const isDbActive = r.is_active === true;
            return (
              <button
                key={id}
                onClick={() => handleSelect(r)}
                disabled={isSwitching}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-rose-50 dark:bg-rose-500/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {isSwitching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isActive
                        ? "text-rose-700 dark:text-rose-300"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {label}
                  </p>
                  {seniority && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {seniority}
                    </p>
                  )}
                </div>
                {isActive && (
                  <Check className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                {!isActive && isDbActive && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                    active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

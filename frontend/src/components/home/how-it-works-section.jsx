import { UploadCloud, BrainCircuit, Target, MessageSquare } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: UploadCloud,
    title: "Upload Resume",
    description:
      "Drop your PDF resume into our secure parsing pipeline. Talk2Job decodes your skills, expertise, and technical background instantly.",
    color: {
      icon: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-200 dark:border-rose-800",
      line: "bg-rose-300 dark:bg-rose-700",
    },
  },
  {
    num: "02",
    icon: BrainCircuit,
    title: "AI Analysis",
    description:
      "Our distributed microservices extract skills, score competencies, and build your professional DNA profile using advanced ML models.",
    color: {
      icon: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-200 dark:border-indigo-800",
      line: "bg-indigo-300 dark:bg-indigo-700",
    },
  },
  {
    num: "03",
    icon: Target,
    title: "Match Opportunities",
    description:
      "AI scans thousands of live opportunities and surfaces the highest-scoring matches tailored precisely to your engineering DNA.",
    color: {
      icon: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-900/20",
      border: "border-sky-200 dark:border-sky-800",
      line: "bg-sky-300 dark:bg-sky-700",
    },
  },
  {
    num: "04",
    icon: MessageSquare,
    title: "Practice Interviews",
    description:
      "Launch AI interview agents calibrated to your target role. Get exhaustive analytics and structured feedback before the real thing.",
    color: {
      icon: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      line: "bg-emerald-300 dark:bg-emerald-700",
    },
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-28 bg-white dark:bg-slate-950"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase">
            How It Works
          </div>
          <h3 className="font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            From upload to opportunity in{" "}
            <span className="text-rose-600">four simple steps</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            No guesswork. No friction. Just precise career telemetry.
          </p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden md:grid grid-cols-4 gap-0 relative">
          {/* Connecting line */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-rose-200 via-indigo-200 to-emerald-200 dark:from-rose-800 dark:via-indigo-800 dark:to-emerald-800 z-0" />

          {STEPS.map((step, idx) => (
            <div
              key={step.num}
              className="relative flex flex-col items-center text-center px-4 z-10"
            >
              {/* Number circle */}
              <div
                className={`w-20 h-20 rounded-2xl ${step.color.bg} border ${step.color.border} flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-105`}
              >
                <step.icon className={`w-8 h-8 ${step.color.icon}`} />
              </div>
              <span
                className={`text-xs font-bold tracking-widest ${step.color.icon} mb-2`}
              >
                STEP {step.num}
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                {step.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden space-y-0">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="relative flex gap-4">
              {/* Vertical line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-xl ${step.color.bg} border ${step.color.border} flex items-center justify-center flex-shrink-0`}
                >
                  <step.icon className={`w-5 h-5 ${step.color.icon}`} />
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-0.5 h-full min-h-[40px] ${step.color.line} my-2`}
                  />
                )}
              </div>
              <div className="pb-8">
                <span
                  className={`text-[10px] font-bold tracking-widest ${step.color.icon}`}
                >
                  STEP {step.num}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {step.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

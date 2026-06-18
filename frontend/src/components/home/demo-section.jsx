import { useState } from "react";
import {
  UploadCloud,
  Target,
  Sparkles,
  Video,
  MessageSquare,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Array of steps mapping the core Talk2Job recruiting workflow features
const DEMO_STEPS = [
  {
    title: "Upload Your CV",
    icon: <UploadCloud className="w-5 h-5 text-rose-600" />,
    description:
      "Drop your PDF resume into our secure parsing pipeline. Talk2Job decodes your implicit architectural skills, core infrastructure knowledge, and technical background instantly.",
    badge: "Step 01",
  },
  {
    title: "Get Top Matches",
    icon: <Target className="w-5 h-5 text-rose-600" />,
    description:
      "Our AI engine scans hundreds of live developer opportunities to find the absolute highest-scoring matches tailored perfectly to your engineering DNA.",
    badge: "Step 02",
  },
  {
    title: "AI Recommendations Score",
    icon: <Sparkles className="w-5 h-5 text-rose-600" />,
    description:
      "Get precise, deep telemetry showing why a specific job fits your profile, highlighting matching tech-stacks and identifying key architectural areas to look into.",
    badge: "Step 03",
  },
  {
    title: "Start Live Interview",
    icon: <Video className="w-5 h-5 text-rose-600" />,
    description:
      "Launch an advanced, real-time AI interview agent customized precisely to the role target. Practice responding to rigorous behavioral and heavy technical questions.",
    badge: "Step 04",
  },
  {
    title: "Get Instant Feedback",
    icon: <MessageSquare className="w-5 h-5 text-rose-600" />,
    description:
      "Receive an exhaustive analytics report breaking down your communication efficiency, code architecture answers, and structured feedback before facing real recruiters.",
    badge: "Step 05",
  },
  {
    title: "Smart Job Alerts",
    icon: <Bell className="w-5 h-5 text-rose-600" />,
    description:
      "Never miss out again. Receive proactive system notifications the absolute instant a new technical offer matches your scanned profile with a score higher than 70%.",
    badge: "Step 06",
  },
];

export default function DemoSection() {
  // Local state tracking the currently visible feature index
  const [currentStep, setCurrentStep] = useState(0);

  // Advances to the next slide with safe circular boundaries
  const nextStep = () => {
    setCurrentStep((prev) => (prev === DEMO_STEPS.length - 1 ? 0 : prev + 1));
  };

  // Navigates to the previous slide with safe circular boundaries
  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? DEMO_STEPS.length - 1 : prev - 1));
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 lg:py-24">
      {/* Ambient background blur mesh matching the primary Hero section layout */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-gradient-to-br from-rose-500/10 via-slate-50 to-rose-600/10 opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Active step contextual icon container */}
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-rose-50/50 border border-rose-100 shadow-sm mb-2">
            {DEMO_STEPS[currentStep].icon}
          </div>

          {/* Section Heading using the professional deep crimson text gradient */}
          <div className="text-center mb-8">
            <h3 className="font-extrabold text-2xl sm:text-4xl max-w-3xl mx-auto px-4 leading-tight tracking-tight text-slate-900">
              Watch how Talk2Job transforms your profile into{" "}
              <span className="bg-gradient-to-r from-slate-900 via-rose-700 to-rose-900 bg-clip-text text-transparent">
                automated career breakthroughs.
              </span>
            </h3>
          </div>

          {/* Core Interactive Card Container mirrored from the visual live dimensions */}
          <div className="w-full max-w-xl mx-auto bg-white rounded-3xl border border-slate-100/80 shadow-xl shadow-slate-200/40 p-6 sm:p-8 relative min-h-[340px] flex flex-col justify-between">
            {/* Upper step progression bar track indicator */}
            <div className="grid grid-cols-6 gap-1.5 mb-6">
              {DEMO_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${
                    idx <= currentStep ? "bg-rose-600" : "bg-slate-100"
                  }`}
                />
              ))}
            </div>

            {/* Dynamic Step Content Workspace */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-4">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 rounded-full border border-rose-100">
                {DEMO_STEPS[currentStep].badge}
              </span>

              <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                {DEMO_STEPS[currentStep].title}
              </h4>

              <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-slate-100/60 text-center max-w-md">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {DEMO_STEPS[currentStep].description}
                </p>
              </div>
            </div>

            {/* Lower Navigation Controls balanced with identical brand button gradients */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
              {/* Left Navigation Trigger Button */}
              <button
                onClick={prevStep}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-700 to-rose-900 hover:opacity-90 active:scale-95 text-white flex items-center justify-center transition shadow-lg shadow-rose-900/25"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Lower Slider Dot Navigation Array */}
              <div className="flex items-center space-x-1.5">
                {DEMO_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      idx === currentStep
                        ? "w-4 bg-rose-600"
                        : "w-2 bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {/* Right Navigation Trigger Button */}
              <button
                onClick={nextStep}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-700 to-rose-900 hover:opacity-90 active:scale-95 text-white flex items-center justify-center transition shadow-lg shadow-rose-900/25"
                aria-label="Next step"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

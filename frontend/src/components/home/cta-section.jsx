import { ArrowRight, Sparkles, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto px-6 relative z-10">
        <div
          className="relative overflow-hidden w-full bg-gradient-to-b from-slate-900 to-slate-950 dark:from-slate-800 dark:to-slate-900 rounded-[32px] p-8 sm:p-14 md:p-20 text-center border border-slate-700/30
          shadow-[0_0_80px_-20px_rgba(217,27,67,0.2)]"
        >
          {/* Inner Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[200px] bg-rose-500/10 rounded-full filter blur-[80px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center space-y-6 md:space-y-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-rose-400 bg-rose-500/[0.06] border border-rose-500/20 uppercase">
              <Sparkles size={10} className="text-rose-400" />
              Start Free Today
            </div>

            <h3 className="font-extrabold text-3xl sm:text-[40px] text-white tracking-tight leading-[1.2]">
              Your Next Career Opportunity <br /> Starts Here
            </h3>

            <p className="text-slate-400/90 text-sm sm:text-[15px] leading-relaxed max-w-xl font-normal">
              Join thousands of professionals using AI to discover better
              opportunities. Upload your resume and get matched in under 60
              seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 w-full sm:w-auto">
              <Link to="/register" className="w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D91B43] hover:bg-[#E11D48] text-white font-bold text-sm px-7 py-3.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] group cursor-pointer
                  shadow-[0_0_25px_0_rgba(217,27,67,0.4)] hover:shadow-[0_0_35px_0_rgba(217,27,67,0.55)]"
                >
                  Start Free
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </Link>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-all duration-300 border border-white/10 cursor-pointer">
                <Calendar size={15} />
                Schedule Demo
              </button>
            </div>

            <span className="text-[11px] text-slate-500/80 font-medium tracking-wide pt-2">
              No credit card required · Free tier available
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

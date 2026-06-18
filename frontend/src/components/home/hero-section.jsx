import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative mx-auto flex flex-col z-0 items-center justify-center
     py-24 sm:py-32 lg:py-40 transition-all px-6 lg:px-12 max-w-5xl"
    >
      <div className="flex flex-col items-center text-center w-full">
        {/* Badge */}
        <div className="mb-8">
          <div
            className="relative p-px overflow-hidden rounded-full
               bg-gradient-to-r from-rose-300 via-rose-500 to-rose-700 
               dark:from-rose-400 dark:via-rose-500 dark:to-rose-700 group"
          >
            <Badge
              variant={"secondary"}
              className="relative px-5 py-2 text-sm font-medium
                 bg-white dark:bg-slate-950 rounded-full group-hover:bg-slate-50 dark:group-hover:bg-slate-900
                 transition-colors duration-200"
            >
              <Sparkles className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400 animate-pulse" />
              <p className="text-slate-700 dark:text-slate-300">
                AI-Powered Hiring Intelligence
              </p>
            </Badge>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-bold text-slate-900 dark:text-white max-w-4xl leading-[1.1]">
          Transform Your Job Search With AI That{" "}
          <span className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 dark:from-rose-400 dark:via-rose-500 dark:to-amber-400 bg-clip-text text-transparent">
            Understands Talent
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mt-6 leading-relaxed">
          Upload your resume, discover matching opportunities, simulate
          interviews, and accelerate your career with enterprise-grade AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link to="/register">
            <Button
              className="text-white text-sm sm:text-base rounded-xl px-8 py-6
                 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600
                 font-semibold shadow-lg shadow-rose-500/20 dark:shadow-rose-500/10
                 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/30"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-sm sm:text-base rounded-xl px-8 py-6
               border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300
               bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800
               font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Play className="w-4 h-4 mr-2 text-rose-500 dark:text-rose-400" />
            <span>Watch Demo</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

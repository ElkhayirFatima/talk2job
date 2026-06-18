import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    company: "Spotify",
    avatar: "SC",
    quote:
      "Talk2Job's AI matching scored 94% for my profile — I landed a role that perfectly aligned with my skills within two weeks. The interview simulator was incredibly realistic.",
    color: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
  },
  {
    name: "Marcus Williams",
    role: "Engineering Manager",
    company: "Shopify",
    avatar: "MW",
    quote:
      "As a recruiter, Talk2Job cut our screening time by 60%. The AI-powered candidate scoring surfaces the best-fit talent before we even review resumes manually.",
    color:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
  },
  {
    name: "Amira Patel",
    role: "Full Stack Developer",
    company: "Stripe",
    avatar: "AP",
    quote:
      "The skill gap detection showed me exactly what to learn. After following the recommendations for two months, my match scores jumped from 72% to 91%.",
    color: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400",
  },
  {
    name: "David Kim",
    role: "Head of Talent",
    company: "Linear",
    avatar: "DK",
    quote:
      "We integrated Talk2Job's API into our ATS. The quality of shortlisted candidates improved dramatically. It's become essential infrastructure for our hiring pipeline.",
    color:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/80 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase">
            Testimonials
          </div>
          <h3 className="font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            Loved by{" "}
            <span className="text-rose-600">engineers and recruiters</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Hear from professionals who transformed their careers and hiring
            processes with Talk2Job.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-6 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

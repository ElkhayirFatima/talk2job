import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How does AI matching work?",
    answer:
      "Talk2Job uses advanced machine learning models to extract skills, experience patterns, and professional DNA from your resume. It then scores and ranks opportunities based on multi-dimensional alignment including technical skills, seniority level, industry fit, and cultural compatibility.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II compliant and never share your data with third-party recruiters without explicit consent. You can delete your data at any time.",
  },
  {
    question: "Can recruiters use Talk2Job?",
    answer:
      "Yes. Talk2Job offers a Recruiter Intelligence suite with bulk candidate scoring, automated shortlisting, analytics dashboards, and API integrations with popular ATS platforms. Enterprise plans include custom models and dedicated support.",
  },
  {
    question: "Do you provide APIs?",
    answer:
      "We offer a full RESTful API with endpoints for resume analysis, job matching, interview simulation, and skill gap detection. Official SDKs are available for Python, Node.js, and .NET. Check our developer documentation for details.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. Our free tier includes 5 resume analyses per month, basic job matching, and 2 AI interview simulations. Pro plans unlock unlimited access, advanced analytics, priority support, and API access.",
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900/30">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-slate-900 dark:text-white pr-4">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase">
            FAQ
          </div>
          <h3 className="font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            Frequently asked questions
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <FaqItem
              key={idx}
              faq={faq}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

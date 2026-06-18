import { Code2, Lock, Server, BookOpen } from "lucide-react";

const API_ENDPOINTS = [
  {
    method: "POST",
    path: "/api/resume/analyze",
    description: "Upload and analyze a resume with AI",
    color:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  },
  {
    method: "POST",
    path: "/api/interview/start",
    description: "Start an AI interview simulation session",
    color: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400",
  },
  {
    method: "GET",
    path: "/api/jobs/recommended",
    description: "Get AI-recommended job matches",
    color:
      "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
  },
];

const CODE_EXAMPLE = `// Authenticate & analyze a resume
const response = await fetch(
  'https://api.talk2job.com/api/resume/analyze',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      resume_url: 'https://...',
      target_role: 'Senior Engineer'
    })
  }
);

const { score, skills, matches } = await response.json();`;

const SDK_CARDS = [
  { name: "Python", version: "v2.4.1", icon: "🐍" },
  { name: "Node.js", version: "v3.1.0", icon: "⬢" },
  { name: ".NET", version: "v1.8.2", icon: "#" },
];

export default function DeveloperSection() {
  return (
    <section
      id="developer"
      className="py-20 lg:py-28 bg-white dark:bg-slate-950"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase">
            Developer Platform
          </div>
          <h3 className="font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            Build with <span className="text-rose-600">Talk2Job API</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            RESTful APIs, SDKs, and webhooks to integrate hiring intelligence
            into your platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Code Example */}
          <div className="bg-[#0d1117] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-slate-500 ml-2 font-mono">
                example.js
              </span>
            </div>
            <pre className="p-5 text-sm text-slate-300 overflow-x-auto font-mono leading-relaxed">
              <code>{CODE_EXAMPLE}</code>
            </pre>
          </div>

          {/* Right - API Cards & SDKs */}
          <div className="space-y-5">
            {/* API Endpoints */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  REST Endpoints
                </p>
              </div>
              {API_ENDPOINTS.map((ep) => (
                <div
                  key={ep.path}
                  className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${ep.color}`}
                    >
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono text-slate-900 dark:text-white">
                      {ep.path}
                    </code>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 ml-[52px]">
                    {ep.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Auth Info */}
            <div className="flex items-start gap-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                  Authentication
                </p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400/80">
                  Bearer token via JWT. OAuth 2.0 supported for enterprise
                  clients.
                </p>
              </div>
            </div>

            {/* SDKs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Official SDKs
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SDK_CARDS.map((sdk) => (
                  <div
                    key={sdk.name}
                    className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800 text-center hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
                  >
                    <p className="text-lg mb-1">{sdk.icon}</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {sdk.name}
                    </p>
                    <p className="text-[10px] text-slate-400">{sdk.version}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

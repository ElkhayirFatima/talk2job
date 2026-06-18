import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Brain,
  Sparkles,
  Target,
} from "lucide-react";
import { parseResume } from "../../api/matching";
import useAuth from "../../hooks/useAuth";

const ACCEPTED = ".pdf,.doc,.docx";
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const processingSteps = [
  { icon: FileText, label: "Reading document...", key: "read" },
  { icon: Brain, label: "Extracting Skills...", key: "skills" },
  { icon: Sparkles, label: "Analyzing Experience...", key: "exp" },
  { icon: Target, label: "Building Profile...", key: "profile" },
];

export default function CVUpload() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const validate = (f) => {
    if (!f) return "Please select a file.";
    if (f.size > MAX_SIZE) return "File exceeds 50 MB limit.";
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext))
      return "Only PDF, DOC, DOCX files are accepted.";
    return null;
  };

  const onSelect = (f) => {
    setError("");
    const msg = validate(f);
    if (msg) {
      setError(msg);
      return;
    }
    setFile(f);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setStep(0);

    // Simulate telemetry steps while real upload happens
    const stepInterval = setInterval(() => {
      setStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    try {
      const res = await parseResume(file, auth?.accessToken);
      clearInterval(stepInterval);
      setStep(processingSteps.length - 1);
      setDone(true);

      setTimeout(() => {
        const resumeId = res.data?.id ?? res.data?.resume_id;
        if (resumeId) {
          localStorage.setItem("resumeId", String(resumeId));
          navigate(`/dashboard?resumeId=${resumeId}`);
        } else {
          navigate("/dashboard");
        }
      }, 1200);
    } catch (err) {
      clearInterval(stepInterval);
      setUploading(false);
      setStep(-1);
      if (!err?.response) {
        setError("No server response. Is the matching service running?");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.detail ?? "Invalid file.");
      } else if (err.response?.status === 422) {
        setError(
          err.response.data?.detail ??
            "Unprocessable file. Try a different format.",
        );
      } else if (err.response?.status === 500) {
        setError(err.response.data?.detail ?? "Server error during parsing.");
      } else {
        setError("Upload failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-4">
            <Upload className="h-3.5 w-3.5" />
            CV UPLOAD ENGINE
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Upload Your Resume
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Our AI parses your CV to extract skills, experience, and
            qualifications for precision job matching.
          </p>
        </div>

        {/* Upload card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          {!uploading ? (
            <>
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-500/5"
                    : file
                      ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-500/5"
                      : "border-slate-300 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPTED}
                  className="hidden"
                  onChange={(e) => onSelect(e.target.files?.[0])}
                />

                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Upload className="h-7 w-7 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Drag & drop your CV here
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        or click to browse · PDF, DOC, DOCX · Max 50 MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleUpload}
                disabled={!file}
                className="mt-6 w-full py-3 rounded-xl text-sm font-semibold transition-colors bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 disabled:cursor-not-allowed dark:bg-rose-600 dark:hover:bg-rose-500"
              >
                Analyze My Resume
              </button>
            </>
          ) : (
            /* Processing telemetry */
            <div className="space-y-5 py-4">
              {processingSteps.map(({ icon: Icon, label, key }, i) => {
                const isActive = i === step;
                const isDone = i < step || done;
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-4 transition-opacity duration-300 ${
                      i > step && !done ? "opacity-30" : "opacity-100"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? "bg-emerald-100 dark:bg-emerald-500/10"
                          : isActive
                            ? "bg-rose-100 dark:bg-rose-500/10"
                            : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 text-rose-600 dark:text-rose-400 animate-spin" />
                      ) : (
                        <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isDone
                          ? "text-emerald-700 dark:text-emerald-400"
                          : isActive
                            ? "text-rose-700 dark:text-rose-400"
                            : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {isDone ? label.replace("...", " ✓") : label}
                    </span>
                  </div>
                );
              })}

              {done && (
                <div className="pt-2 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Analysis complete — redirecting...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

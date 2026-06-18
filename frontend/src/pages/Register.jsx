import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { FileText, Eye, EyeOff, Loader2 } from "lucide-react";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/api/auth/register";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [showMatchPwd, setShowMatchPwd] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setValidName(USER_REGEX.test(username));
  }, [username]);
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === matchPwd);
  }, [password, matchPwd]);
  useEffect(() => {
    setErrMsg("");
  }, [username, email, password, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);
    const v3 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        REGISTER_URL,
        JSON.stringify({
          username,
          email,
          password,
          confirmPassword: matchPwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      setSuccess(true);
      setUsername("");
      setEmail("");
      setPassword("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) setErrMsg("No Server Response");
      else if (err.response?.status === 409) setErrMsg("Username Taken");
      else setErrMsg("Registration Failed");
      if (errRef.current) errRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
              <div className="mb-6 flex justify-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-4">
                  <svg
                    className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Account Created!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                Welcome! Your account has been successfully created.
              </p>
              <Link
                to="/login"
                className="inline-block w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-2.5 px-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-sm"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
              {errMsg && (
                <p
                  ref={errRef}
                  className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium"
                  aria-live="assertive"
                  role="alert"
                >
                  {errMsg}
                </p>
              )}

              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center gap-2 mb-4">
                  <FileText className="w-7 h-7 text-rose-600" />
                  <span className="font-extrabold text-xl text-slate-900 dark:text-white">
                    Talk2Job
                  </span>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  Create your account
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Start your AI-powered career journey
                </p>
              </div>

              {/* OAuth */}
              <div className="space-y-2 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href =
                      "http://localhost:5106/api/auth/login-google")
                  }
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href =
                      "http://localhost:5106/api/auth/login-github")
                  }
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  or
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"
                  >
                    Name
                    {validName && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-emerald-500 text-sm"
                      />
                    )}
                    {!validName && username && (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 text-sm"
                      />
                    )}
                  </label>
                  <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                    placeholder="Choose a username"
                  />
                  {userFocus && username && !validName && (
                    <p
                      id="uidnote"
                      className="mt-2 p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 rounded-xl text-xs"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />4
                      to 24 characters. Must begin with a letter. Letters,
                      numbers, underscores, hyphens allowed.
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"
                  >
                    Email
                    {validEmail && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-emerald-500 text-sm"
                      />
                    )}
                    {!validEmail && email && (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 text-sm"
                      />
                    )}
                  </label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    aria-invalid={validEmail ? "false" : "true"}
                    aria-describedby="emailnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                    placeholder="you@email.com"
                  />
                  {emailFocus && email && !validEmail && (
                    <p
                      id="emailnote"
                      className="mt-2 p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 rounded-xl text-xs"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                      Please enter a valid email address.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"
                  >
                    Password
                    {validPwd && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-emerald-500 text-sm"
                      />
                    )}
                    {!validPwd && password && (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 text-sm"
                      />
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                      aria-invalid={validPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPwd ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {pwdFocus && !validPwd && (
                    <p
                      id="pwdnote"
                      className="mt-2 p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 rounded-xl text-xs"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />8
                      to 24 characters. Must include uppercase, lowercase, a
                      number and a special character (!@#$%).
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm_pwd"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2"
                  >
                    Confirm Password
                    {validMatch && matchPwd && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-emerald-500 text-sm"
                      />
                    )}
                    {!validMatch && matchPwd && (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 text-sm"
                      />
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showMatchPwd ? "text" : "password"}
                      id="confirm_pwd"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      value={matchPwd}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      className="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-sm"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMatchPwd(!showMatchPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showMatchPwd ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {matchFocus && !validMatch && matchPwd && (
                    <p
                      id="confirmnote"
                      className="mt-2 p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 rounded-xl text-xs"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                      Must match your password.
                    </p>
                  )}
                </div>

                <button
                  disabled={
                    !validName ||
                    !validEmail ||
                    !validPwd ||
                    !validMatch ||
                    loading
                  }
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm ${
                    validName && validEmail && validPwd && validMatch
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 cursor-pointer"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Sign Up
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Already registered?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                By signing up, you agree to our{" "}
                <a
                  href="#"
                  className="underline hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;

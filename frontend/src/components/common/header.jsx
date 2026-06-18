import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { FileText, Menu, X, Moon, Sun, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "AI Playground", href: "/#playground" },
  { label: "Docs & API", href: "/#developer" },
];

const ENTERPRISE_LINKS = [
  { label: "Recruiter Dashboard", href: "/#features" },
  { label: "Analytics & Telemetry", href: "/#stats" },
  { label: "API & Integrations", href: "/#developer" },
  { label: "Enterprise Security", href: "/#faq" },
];

const Header = () => {
  const { auth } = useAuth();
  const isLoggedIn = !!auth?.accessToken;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const scrollToSection = (e, href) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
      setEnterpriseOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav
        className="container flex items-center justify-between py-3 lg:py-4 lg:px-8 px-4 mx-auto max-w-7xl"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="flex items-center gap-2 group">
            <FileText className="w-6 h-6 lg:w-7 lg:h-7 text-rose-600 group-hover:rotate-12 transform transition duration-200" />
            <span className="font-extrabold text-lg lg:text-xl text-slate-900 dark:text-white tracking-tight">
              Talk2Job
            </span>
          </Link>
        </div>

        {/* Desktop Center Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          {/* Enterprise dropdown */}
          <div className="relative">
            <button
              onClick={() => setEnterpriseOpen(!enterpriseOpen)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              Enterprise
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${enterpriseOpen ? "rotate-180" : ""}`}
              />
            </button>
            {enterpriseOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-2 z-50">
                {ENTERPRISE_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex lg:flex-1 justify-end items-center gap-3">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white rounded-lg px-5 shadow-sm shadow-rose-500/20 transition-all duration-200"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-4 pb-6 pt-2">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-800 my-2" />
            <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Enterprise
            </p>
            {ENTERPRISE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-800 my-2" />
            <div className="flex flex-col gap-2 px-3">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 py-2"
                  >
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white rounded-lg shadow-sm shadow-rose-500/20">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

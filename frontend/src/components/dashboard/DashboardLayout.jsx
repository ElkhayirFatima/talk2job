import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Upload,
  Mic,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import { getUnreadCount } from "../../api/matching";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/dashboard/upload", icon: Upload, label: "Upload CV" },
  { to: "/dashboard/jobs", icon: Briefcase, label: "Job Matches" },
  { to: "/dashboard/interview", icon: Mic, label: "Interview Sim" },
  { to: "/dashboard/feedback", icon: BarChart3, label: "Feedback" },
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);
  const { auth } = useAuth();
  const logout = useLogout();
  const location = useLocation();

  useEffect(() => {
    if (!auth?.userId) return;
    getUnreadCount(auth.userId)
      .then((res) => setUnread(res.data?.unread_count ?? res.data?.count ?? 0))
      .catch(() => {});
  }, [location.pathname, auth?.userId]);

  return (
    <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-60"
        } flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 shrink-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="h-8 w-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            T2J
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              Talk2Job
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-2 space-y-1">
          {/* Notification badge */}
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 w-full transition-colors relative">
            <Bell className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Notifications</span>}
            {unread > 0 && (
              <span className="absolute top-1 left-7 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-rose-600 text-[10px] text-white font-bold">
                {unread}
              </span>
            )}
          </button>

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
            {!collapsed && (
              <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                {auth?.user ?? "User"}
              </span>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        <Outlet />
      </main>
    </div>
  );
}

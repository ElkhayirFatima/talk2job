import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const user =
        decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      const userId =
        decoded?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      const roleClaim =
        decoded?.[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      const roles = roleClaim
        ? Array.isArray(roleClaim)
          ? roleClaim
          : [roleClaim]
        : [];

      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("persist", "true");

      setAuth({ user, accessToken, refreshToken, userId, roles });

      navigate("/dashboard", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <p className="text-slate-500 dark:text-slate-400">Signing you in...</p>
    </div>
  );
};

export default OAuthCallback;

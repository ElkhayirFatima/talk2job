// On importe notre instance axios "publique"
import axios from "../api/axios";

import useAuth from "./useAuth";
import { jwtDecode } from "jwt-decode";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");

    if (!refreshToken || !userId) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      "/api/auth/refresh-token",
      JSON.stringify({ userId, refreshToken }),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    const decoded = jwtDecode(newAccessToken);
    const user =
      decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const newUserId =
      decoded?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];
    const roleClaim =
      decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const roles = roleClaim
      ? Array.isArray(roleClaim)
        ? roleClaim
        : [roleClaim]
      : [];

    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("userId", newUserId);

    setAuth({
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: newUserId,
      roles,
    });

    return newAccessToken;
  };

  return refresh;
};

export default useRefreshToken;

import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { auth, setAuth } = useAuth();

  const logout = async () => {
    try {
      const refreshToken =
        auth?.refreshToken || localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosPrivate.post(
          "/api/auth/logout",
          JSON.stringify(refreshToken),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAuth({});
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
    }
  };

  return logout;
};

export default useLogout;

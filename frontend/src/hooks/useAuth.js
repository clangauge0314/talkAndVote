import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const useAuth = () => {
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password, onSuccess) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "로그인 성공!",
          text: "환영합니다.",
          confirmButtonColor: "#34D399",
        }).then(() => {
          setIsAuthenticated(true);
          onSuccess();
        });
        return true;
      }
    } catch (error) {
      setError(error.response?.data.message || "로그인에 실패했습니다.");
      return false;
    }
  };

  const signup = async (userData, onSuccess) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup/`,
        userData
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "회원가입 성공!",
          text: "TalkAndVote에 오신 것을 환영합니다!",
          confirmButtonColor: "#34D399",
        }).then(() => {
          setIsAuthenticated(true);
          onSuccess();
        });
        return true;
      }
    } catch (error) {
      setError(error.response?.data.message || "회원가입에 실패했습니다.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout/`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      Swal.fire({
        icon: "info",
        title: "로그아웃 되었습니다.",
        confirmButtonColor: "#34D399",
      }).then(() => {
        window.location.href = "/login";
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const verifyJWT = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-tokens/`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error("JWT 검증 실패:", error.response?.data.error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    verifyJWT();
  }, []);

  return {
    error,
    setError,
    isAuthenticated,
    login,
    signup,
    logout,
    verifyJWT,
  };
};

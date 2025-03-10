import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setMembershipGrade } from '../store/membershipSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [lastVerified, setLastVerified] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login/`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser(response.data);
        setIsAuthenticated(true);
        await verifyJWT();
        
        Swal.fire({
          icon: "success",
          title: "로그인 성공!",
          text: "환영합니다.",
          confirmButtonColor: "#34D399",
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data.detail || "로그인에 실패했습니다.");
      setIsAuthenticated(false);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/signup/`,
        userData
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "회원가입 성공!",
          text: "이메일 인증을 완료하여 계정을 활성화해주세요.",
          confirmButtonColor: "#34D399",
        });
        return true;
      }
      return false;
    } catch (error) {
      setError(error.response?.data.detail || "회원가입에 실패했습니다.");
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/logout`,{},
        { 
          withCredentials: true,
        }
      );
      
      setIsAuthenticated(false);
      setUser(null);
      setLastVerified(0);
      
      if (response.status === 200) {
        Swal.fire({
          icon: "info",
          title: "로그아웃 되었습니다.",
          confirmButtonColor: "#34D399",
        }).then(() => {
          navigate("/");
        });
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
      setIsAuthenticated(false);
      setUser(null);
      setLastVerified(0);
      navigate("/");
    }
  };

  const fetchMembershipGrade = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/membership`,
        { withCredentials: true }
      );
      dispatch(setMembershipGrade(response.data));
    } catch (error) {
      console.error("멤버십 정보 조회 실패:", error);
    }
  };

  const verifyJWT = async (force = false) => {
    const now = Date.now();
    const VERIFY_INTERVAL = 5 * 60 * 1000;

    if (!force && now - lastVerified < VERIFY_INTERVAL) {
      return isAuthenticated;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/`,
        { withCredentials: true }
      );

      setIsAuthenticated(true);
      setUser(response.data);
      setLastVerified(now);
      setIsLoading(false);
      await fetchMembershipGrade();
      return true;

    } catch (error) {
      console.error("JWT 검증 실패:", error);
      if (error.response?.status === 401) {
        if (lastVerified !== 0) {
          Swal.fire({
            icon: "error",
            title: "로그인 만료",
            text: "로그인이 만료되었습니다. 다시 로그인해주세요.",
            confirmButtonColor: "#34D399",
          });
        }
      }
      setIsAuthenticated(false);
      setUser(null);
      setLastVerified(0);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    verifyJWT(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        error,
        setError,
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        verifyJWT,
        isLoading,
        fetchMembershipGrade,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

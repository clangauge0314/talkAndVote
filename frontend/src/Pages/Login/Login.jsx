import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrorDetails(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("Logged in successfully:", response.data.message);
        setError("");
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;

        if (status === 400) {
          setError("입력값을 확인해주세요.");
          setErrorDetails(errorData.details || "입력값이 잘못되었습니다.");
        } else if (status === 401) {
          setError("이메일 또는 비밀번호가 잘못되었습니다.");
          setErrorDetails(errorData.message || "인증에 실패했습니다.");
        } else if (status === 403) {
          setError("접근이 허용되지 않았습니다.");
          setErrorDetails(errorData.message || "권한이 없습니다.");
        } else {
          setError("알 수 없는 오류가 발생했습니다. 다시 시도해주세요.");
          setErrorDetails(errorData.message || "서버 오류가 발생했습니다.");
        }
      } else {
        setError("서버와 연결할 수 없습니다. 네트워크를 확인해주세요.");
        setErrorDetails("인터넷 연결 상태를 확인하세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-gray-100 py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-12 border border-gray-100">
          <div>
            <h2 className="mt-4 text-center text-6xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              로그인
            </h2>
          </div>
          <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="group">
                <label htmlFor="email" className="sr-only">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 text-xl
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-all duration-200 ease-in-out
                  hover:border-emerald-300"
                  placeholder="이메일"
                  onChange={handleChange}
                />
              </div>
              <div className="group">
                <label htmlFor="password" className="sr-only">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 text-xl
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-all duration-200 ease-in-out
                  hover:border-emerald-300"
                  placeholder="비밀번호"
                  onChange={handleChange}
                />
              </div>
            </div>
            {error && (
              <div className="mt-4 p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-bold">{error}</p>
                {errorDetails && (
                  <p className="text-sm text-center text-gray-700 mt-2">
                    {typeof errorDetails === "string"
                      ? errorDetails
                      : JSON.stringify(errorDetails)}
                  </p>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-xl font-medium rounded-xl text-white
                bg-gradient-to-r from-emerald-600 to-emerald-500 
                hover:from-emerald-700 hover:to-emerald-600
                transform transition-all duration-200 ease-in-out
                hover:scale-[1.02] active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                shadow-lg hover:shadow-xl"
              >
                로그인
              </button>
            </div>
          </form>
          <div className="text-center">
            <Link
              to="/signup"
              className="text-emerald-600 hover:text-emerald-500 text-xl font-medium
              transition-all duration-200 ease-in-out
              hover:underline decoration-2 underline-offset-4"
            >
              회원가입하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

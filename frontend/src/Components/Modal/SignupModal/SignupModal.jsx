import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

const SignupModal = ({ isOpen, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { error, setError, signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const { email, username, password, confirmPassword } = formData;

    if (!email.includes("@")) {
      setError("유효한 이메일을 입력하세요.");
      return;
    }

    if (username.length < 2) {
      setError("닉네임은 최소 2글자 이상이어야 합니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자리 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const success = await signup({ email, username, password });

      if (success) {
        setFormData({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });

        onLoginClick();
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100 bg-black/50" : "opacity-0 invisible"
      } flex items-center justify-center z-50`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg p-8 w-full max-w-md transform transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-900">회원가입</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="닉네임"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg transition-colors hover:bg-emerald-600"
          >
            가입하기
          </button>
        </form>

        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={onLoginClick}
              className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;

import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const LoginModal = ({ isOpen, onClose, onSignupClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email.includes("@")) {
      setError("유효한 이메일을 입력하세요.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자리 이상이어야 합니다.");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "로그인 성공!",
          text: "환영합니다.",
          confirmButtonColor: "#34D399",
        }).then(() => {
          onClose();
        });
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "로그인에 실패했습니다.");
      } else {
        setError("서버와의 연결이 원활하지 않습니다.");
      }
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
          <h2 className="text-2xl font-bold text-emerald-900">로그인</h2>
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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            로그인
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <button className="text-sm text-gray-600 hover:text-emerald-500 transition-colors">
            비밀번호를 잊으셨나요?
          </button>
          <div className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <button
              onClick={onSignupClick}
              className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../firebase/firebase-init";

const SignupModal = ({ isOpen, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    verificationCode: "",
  });

  const [showVerification, setShowVerification] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateRecaptcha = () => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized");
      }

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: (response) => {
            console.log("reCAPTCHA solved:", response);
          },
          "expired-callback": () => {
            console.error("reCAPTCHA expired");
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }
          },
        }
      );

      return window.recaptchaVerifier;
    } catch (error) {
      console.error("reCAPTCHA initialization error:", error);
      throw error;
    }
  };

  const handleSendVerification = async () => {
    try {
      if (!formData.phone) {
        setError("휴대폰 번호를 입력해주세요.");
        return;
      }

      const appVerifier = await generateRecaptcha();
      if (!appVerifier) {
        throw new Error("Failed to initialize reCAPTCHA");
      }

      const phoneNumber = "+82" + formData.phone.replace(/^0/, "");
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      setVerificationId(confirmationResult);
      setShowVerification(true);
      setIsSendingCode(true);
      setError("");
      
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      console.error("인증번호 발송 오류:", error);
      setError("인증번호 발송에 실패했습니다. 다시 시도해주세요.");

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verificationId.confirm(formData.verificationCode);
      setIsPhoneVerified(true);
      alert("휴대폰 인증이 완료되었습니다.");
    } catch (error) {
      console.error(error);
      setError("잘못된 인증번호입니다.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const { email, username, password, confirmPassword, phone } = formData;

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

    if (!isPhoneVerified) {
      setError("휴대폰 인증이 필요합니다.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup/`,
        {
          email,
          username,
          password,
          phone,
        }
      );

      console.log(response);

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "회원가입 성공!",
          text: "TalkAndVote에 오신것을 환영합니다!",
          confirmButtonColor: "#34D399",
        }).then(() => {
          onClose();
        });

        onClose();
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.message || "회원가입에 실패했습니다.");
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

          <div className="flex gap-2">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="휴대폰 번호 (-없이 입력)"
              className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
            <button
              type="button"
              onClick={handleSendVerification}
              disabled={isSendingCode}
              className={`w-1/4 px-4 py-2 bg-emerald-500 text-white rounded-lg transition-colors ${
                isSendingCode ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600"
              }`}
            >
              발송하기
            </button>
          </div>

          {showVerification && (
            <div className="flex gap-2">
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder="인증번호 입력"
                className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isPhoneVerified}
                className={`w-1/4 px-4 py-2 bg-emerald-500 text-white rounded-lg transition-colors ${
                  isPhoneVerified ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600"
                }`}
              >
                인증하기
              </button>
            </div>
          )}

          <div className="flex justify-center items-center" id="recaptcha-container"></div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={!isPhoneVerified}
            className={`w-full px-4 py-2 bg-emerald-500 text-white rounded-lg transition-colors ${
              !isPhoneVerified
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-emerald-600"
            }`}
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

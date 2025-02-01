import React from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaGoogle, FaGithub } from "react-icons/fa";

const LoginModal = ({ isOpen, onClose, onSignupClick }) => {
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
        onClick={e => e.stopPropagation()}
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

        <div className="space-y-4 mb-6">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-red-500 hover:bg-red-600 text-white">
            <FaGoogle className="text-xl" />
            Google로 계속하기
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-gray-800 hover:bg-gray-700 text-white">
            <FaGithub className="text-xl" />
            Github로 계속하기
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-[#FEE500] hover:bg-[#FEE500]/80 text-white">
            <RiKakaoTalkFill className="text-xl" />
            카카오로 계속하기
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="이메일"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
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

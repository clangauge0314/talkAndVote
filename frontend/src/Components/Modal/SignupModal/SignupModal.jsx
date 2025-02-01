import React from "react";

const SignupModal = ({ isOpen, onClose, onLoginClick }) => {
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
          <h2 className="text-2xl font-bold text-emerald-900">회원가입</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
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
              type="text"
              placeholder="닉네임"
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
          <div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
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

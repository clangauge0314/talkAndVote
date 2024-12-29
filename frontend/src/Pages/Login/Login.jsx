import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 구현
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
                <label htmlFor="email" className="sr-only">이메일</label>
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
                <label htmlFor="password" className="sr-only">비밀번호</label>
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
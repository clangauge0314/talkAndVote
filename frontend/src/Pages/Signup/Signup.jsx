import React, { useState } from "react";
import axios from "axios";
import PhoneVerification from "../../Components/PhoneVerification/PhoneVerification";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setSuccessMessage("");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup/`,
        {
          email: formData.email,
          password: formData.password,
          username: formData.name,
        }
      );

      console.log(response.status);

      if (response.status === 201) {
        setSuccessMessage("회원가입이 성공적으로 완료되었습니다!");
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: ''
        });
        <PhoneVerification />
      }

    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.email) {
          setError(err.response.data.email);
        } else if (err.response.data.username) {
          setError(err.response.data.username);
        } else {
          setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      setSuccessMessage("");
      console.error(err);
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
              회원가입
            </h2>
          </div>
          <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="group">
                <label htmlFor="name" className="sr-only">
                  이름
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 text-xl 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-all duration-200 ease-in-out
                  hover:border-emerald-300"
                  placeholder="이름"
                  onChange={handleChange}
                />
              </div>
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
              <div className="group">
                <label htmlFor="confirmPassword" className="sr-only">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-200 placeholder-gray-400 text-gray-900 text-xl 
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  transition-all duration-200 ease-in-out
                  hover:border-emerald-300"
                  placeholder="비밀번호 확인"
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center text-xl font-medium">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="text-green-500 text-center text-xl font-medium">
                {successMessage}
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
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

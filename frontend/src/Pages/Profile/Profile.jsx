import { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { format } from "date-fns";

export default function Profile() {
  const { loading, getMyProfile, updateProfile, deleteAccount } = useProfile();
  const [formData, setFormData] = useState({
    username: "",
    birthdate: "",
    gender: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const myProfile = await getMyProfile();
      setFormData(myProfile);
    };
    fetchProfile();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.profile_url ? (
                <img
                  src={formData.profile_url}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-400">
                  {formData.username.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <div className="ml-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {formData.username}
            </h1>
            <p className="text-gray-500 mt-1">{formData.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                사용자명
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 text-lg"
                placeholder="사용자명을 입력하세요"
              />
              <div className="absolute right-3 top-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                생년월일
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 text-lg"
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                성별
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 text-lg"
              >
                <option value="">선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  저장 중...
                </div>
              ) : (
                "변경사항 저장"
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">계정 삭제</h2>
          <p className="text-gray-600 mb-6">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은
            되돌릴 수 없습니다.
          </p>
          <button
            onClick={deleteAccount}
            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            계정 영구 삭제
          </button>
        </div>
      </div>
    </div>
  );
}

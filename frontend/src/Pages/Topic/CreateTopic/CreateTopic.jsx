import React, { useState } from "react";
import { useTopic } from "../../../hooks/useTopic";

const CreateTopic = () => {
  const { addTopic } = useTopic();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    vote_options: [""],
    category: "",
  });

  const categories = [
    "유머/이슈",
    "정치",
    "경제",
    "암호화폐",
    "스포츠",
    "연애",
    "IT",
    "기타",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVoteOptionChange = (index, value) => {
    const updatedOptions = [...formData.vote_options];
    updatedOptions[index] = value;
    setFormData((prev) => ({ ...prev, vote_options: updatedOptions }));
  };

  const addVoteOption = () => {
    setFormData((prev) => ({
      ...prev,
      vote_options: [...prev.vote_options, ""],
    }));
  };

  const removeVoteOption = (index) => {
    const updatedOptions = formData.vote_options.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, vote_options: updatedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const result = await addTopic(formData); 

        if (result) { 
            setFormData({
                title: "",
                description: "",
                voteOptions: [""],
                category: "",
            });

            Swal.fire({
                icon: "success",
                title: "토픽이 성공적으로 생성되었습니다!",
                text: "새로운 토픽이 추가되었습니다.",
                confirmButtonColor: "#34D399",
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "오류 발생",
            text: error.response?.data?.error || "토픽을 생성할 수 없습니다.",
            confirmButtonColor: "#EF4444",
        });
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-3xl w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">새로운 토픽 생성</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="토픽 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24"
              placeholder="토픽에 대한 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              투표 옵션 <span className="text-red-500">*</span>
            </label>
            {formData.vote_options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleVoteOptionChange(index, e.target.value)}
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder={`옵션 ${index + 1}`}
                />
                {formData.vote_options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVoteOption(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addVoteOption}
              className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 mt-2"
            >
              옵션 추가
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="" disabled>
                카테고리를 선택하세요
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 font-semibold"
            >
              토픽 생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopic;

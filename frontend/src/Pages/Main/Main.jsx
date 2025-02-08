import { React, useEffect, useState } from "react";
import { useTopic } from "../../hooks/useTopic";

const voteColors = ["blue", "yellow", "orange", "purple", "pink", "teal"];

const Main = () => {
  const { fetchTopics } = useTopic();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      const data = await fetchTopics();
      if (data) setTopics(data);
      setLoading(false);
    };

    loadTopics();
  }, []);

  const popularTopics = ["웹개발", "AI/ML", "모바일앱", "데이터사이언스", "클라우드"];

  return (
    <div className="w-full px-4 py-4 bg-white">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex gap-3 flex-wrap">
            {popularTopics.map((topic, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-sm"
              >
                {topic}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all duration-200">
              필터
            </button>
            <select className="px-4 py-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
              <option value="views">조회순</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-center text-gray-500 col-span-4">로딩 중...</p>
          ) : topics.length > 0 ? (
            topics.map((topic) => {
              const totalVotes = topic.total_vote || 1; 
              return (
                <div
                  key={topic.topic_id}
                  className={`border border-emerald-100 rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-[250px] ${
                    topic.has_voted ? "opacity-80" : ""
                  }`}
                >
                  <h3 className="text-base font-semibold mb-4 text-emerald-900 line-clamp-2 h-[48px]">
                    {topic.title}
                  </h3>

                  <div className="flex gap-2 mb-2">
                    {topic.vote_options.map((option, index) => {
                      const votePercentage = totalVotes
                        ? Math.round((topic.vote_results[index] / totalVotes) * 100)
                        : 0;

                      let buttonColor = "gray"; 
                      if (topic.vote_options.length === 2) {
                        buttonColor = index === 0 ? "emerald" : "red"; 
                      } else {
                        buttonColor = voteColors[index % voteColors.length]; 
                      }

                      return (
                        <div key={index} className="w-full relative">
                          <button
                            className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              topic.has_voted
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : `bg-${buttonColor}-500 text-white hover:bg-${buttonColor}-600`
                            }`}
                            disabled={topic.has_voted}
                          >
                            {option}
                          </button>
                          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 relative overflow-hidden">
                            <div
                              className={`absolute h-full bg-${buttonColor}-500 rounded-full`}
                              style={{ width: `${votePercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 block mt-1">
                            {votePercentage}% ({topic.vote_results[index]}표)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(topic.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <i className="fas fa-heart"></i>
                        {topic.like_count}
                      </span>
                      {topic.has_voted && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded">
                          투표 완료
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-4">등록된 토픽이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;

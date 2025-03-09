import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTopic } from "../../hooks/useTopic";
import { useVote } from "../../hooks/useVote";
import Swal from "sweetalert2";

const voteColors = {
  2: [
    { bg: "#10B981", hover: "#059669" },
    { bg: "#F43F5E", hover: "#E11D48" },
  ],
  3: [
    { bg: "#10B981", hover: "#059669" },
    { bg: "#F43F5E", hover: "#E11D48" },
    { bg: "#3B82F6", hover: "#2563EB" },
  ],

  4: [
    { bg: "#10B981", hover: "#059669" },
    { bg: "#F43F5E", hover: "#E11D48" },
    { bg: "#3B82F6", hover: "#2563EB" },
    { bg: "#A855F7", hover: "#9333EA" },
  ],
};

const Main = () => {
  const { fetchTopics } = useTopic();
  const { submitVote } = useVote();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleVote = async (topicId, optionIndex) => {
    const success = await submitVote({ topic_id: topicId, vote_index: optionIndex });

    if (success) {
      const data = await fetchTopics();
      if (data) {
        setTopics(data);
      }
    }
  };


  useEffect(() => {
    const loadTopics = async () => {
      const data = await fetchTopics();
      if (data) {
        // const topicsWithRandomVotes = data.map(topic => {
        //   const totalVotes = Math.floor(Math.random() * 1000) + 100; 
        //   const voteResults = [];
        //   let remainingVotes = totalVotes;

        //   for (let i = 0; i < topic.vote_options.length - 1; i++) {
        //     const votes = Math.floor(Math.random() * remainingVotes);
        //     voteResults.push(votes);
        //     remainingVotes -= votes;
        //   }
        //   voteResults.push(remainingVotes);

        //   return {
        //     ...topic,
        //     vote_results: voteResults,
        //     total_vote: totalVotes,
        //     has_voted: Math.random() > 0.5, 
        //     selected_option: Math.floor(Math.random() * topic.vote_options.length)
        //   };
        // });

        setTopics(data);
      }
      setLoading(false);
    };

    loadTopics();
  }, []);

  const popularTopics = [
    "웹개발",
    "AI/ML",
    "모바일앱",
    "데이터사이언스",
    "클라우드",
  ];

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
              return (
                <Link to={`/topic/${topic.topic_id}`}>
                  <div
                    key={topic.topic_id}
                    className={`border-2 border-emerald-300 rounded-lg p-4 hover:shadow-lg transition-all duration-200 flex flex-col h-full relative ${topic.has_voted ? 'bg-gray-300' : 'bg-white'
                      }`}

                  >
                    {topic.has_voted && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-lg z-10 opacity-100 hover:opacity-0 transition-opacity duration-200">
                        <span className="bg-emerald-500 text-white text-xl font-bold px-6 py-4 rounded-lg shadow-md">
                          이미 투표한 토픽입니다
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col h-full">
                      <h3 className="text-xl font-semibold mb-2 text-emerald-600 line-clamp-2">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {topic.description}
                      </p>

                      <div className="w-full h-5 bg-gray-300 rounded-full mb-4 relative overflow-hidden">
                        {topic.vote_options.map((_, index) => {
                          const optionCount = topic.vote_options.length;
                          const colors = voteColors[optionCount];
                          const percentage =
                            topic.total_vote === 0
                              ? 0
                              : (topic.vote_results[index] / topic.total_vote) * 100;

                          const previousPercentagesSum = topic.vote_results
                            .slice(0, index)
                            .reduce((acc, curr) => {
                              return acc + (topic.total_vote === 0
                                ? 0
                                : (curr / topic.total_vote) * 100);
                            }, 0);

                          return (
                            <div
                              key={index}
                              className="absolute h-full"
                              style={{
                                backgroundColor: colors[index].bg,
                                left: `${previousPercentagesSum}%`,
                                width: `${percentage}%`,
                                transition: "width 0.3s ease-in-out",
                              }}
                            >
                              {/* {percentage > 0 && (
                              <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-white font-medium drop-shadow-md">
                                {Math.round(percentage)}%
                              </span>
                            )} */}
                            </div>
                          );
                        })}
                      </div>

                      <div className={`space-y-2 ${topic.has_voted ? 'bg-gray-300' : 'bg-gray-100'} p-3 rounded-lg mb-3`}>
                        {topic.vote_options.map((option, index) => {
                          const optionCount = topic.vote_options.length;
                          const colors = voteColors[optionCount];
                          return (
                            <button
                              key={index}
                              className="w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200"
                              style={{
                                backgroundColor: topic.has_voted
                                  ? (topic.user_vote_index === index ? colors[index].bg : '#9CA3AF')
                                  : colors[index].bg,
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                if (!topic.has_voted) {
                                  console.log(`User clicked on topic ${topic.topic_id}, option ${index}`);
                                  handleVote(topic.topic_id, index);
                                }
                              }}
                              disabled={topic.has_voted}
                              onMouseOver={(e) => {
                                if (!topic.has_voted) {
                                  e.currentTarget.style.backgroundColor = colors[index].hover;
                                }
                              }}
                              onMouseOut={(e) => {
                                if (!topic.has_voted) {
                                  e.currentTarget.style.backgroundColor = colors[index].bg;
                                } else {
                                  e.currentTarget.style.backgroundColor =
                                    topic.user_vote_index === index ? colors[index].bg : '#9CA3AF';
                                }
                              }}
                            >
                              <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="text-sm ml-2 text-white">
                                  {option}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-white">
                                  {topic.vote_results[index]}표
                                </span>
                                <span className="text-sm font-medium text-white">
                                  {Math.round(
                                    topic.total_vote === 0 ? 0 : (topic.vote_results[index] / topic.total_vote) * 100
                                  )}%
                                </span>
                              </div>
                            </button>
                          );
                        })}

                      </div>

                      <div className="mt-auto pt-4 flex justify-between items-center text-xs text-gray-400 border-t  border-gray-300">
                        <span>
                          {new Date(topic.created_at).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            <i className="fas fa-heart"></i>
                            {topic.like_count}
                          </span>
                          <span className="px-1.5 py-0.5 bg-whit rounded-full whitespace-nowrap">
                            총 {topic.total_vote}표
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-4">
              등록된 토픽이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;

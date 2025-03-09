import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Heart, CheckCircle, Calendar } from "lucide-react";
import classNames from "classnames";
import { useTopic } from "../../../hooks/useTopic";
import { useLike } from "../../../hooks/useLike";
import { useVote } from "../../../hooks/useVote";
import { useComment } from "../../../hooks/useComment";

import Comments from "./Comments";
import Chart from './Chart';

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

const SingleTopic = () => {
  const { id } = useParams();
  const { getTopicById, getTopicVotes } = useTopic();
  const { toggleTopicLike } = useLike();
  const { submitVote } = useVote();
  const { createComment, getComments, loading: commentLoading } = useComment();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("ALL");
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVoteIndex, setUserVoteIndex] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [chartMetric, setChartMetric] = useState('count');
  const [chartLoading, setChartLoading] = useState(false);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = Math.ceil((comments?.length || 0) / itemsPerPage);
    
    return {
      currentPageData: comments?.slice(startIndex, endIndex) || [],
      totalPages
    };
  }, [comments, currentPage, itemsPerPage]);

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    const topicData = await getTopicById(id);
  
    if (topicData) {
      setTopic((prevTopic) => {
        if (JSON.stringify(prevTopic) === JSON.stringify(topicData)) {
          return prevTopic;
        }
        return topicData;
      });
  
      setHasVoted(topicData.has_voted);
      setUserVoteIndex(topicData.user_vote_index);
      setLikes(topicData.like_count);
      setLiked(topicData.has_liked);
    }
    setLoading(false);
  }, [id, getTopicById]);

  const fetchTopicVotes = async (frame) => {
    setChartLoading(true);
    try {
      const voteData = await getTopicVotes(id, frame);
      
      if (voteData && topic) {
        const lastDataPoint = Object.values(voteData)[Object.keys(voteData).length - 1];
        const voteResults = Object.values(lastDataPoint).map(v => v.count || 0);
        const totalVote = voteResults.reduce((sum, count) => sum + count, 0);

        const chartData = Object.entries(voteData).map(([timestamp, data]) => {
          return {
            time: data.formattedTime,
            total: Object.values(data).reduce((sum, v) => {
              if (typeof v === 'object' && (v.count !== undefined)) {
                return sum + (v.count || 0);
              }
              return sum;
            }, 0),
            ...Object.entries(data).reduce((obj, [idx, values]) => {
              if (typeof values === 'object' && (values.count !== undefined)) {
                return {
                  ...obj,
                  [`count_${idx}`]: values.count || 0,
                  [`percent_${idx}`]: values.percent || 0
                };
              }
              return obj;
            }, {})
          };
        });

        setTopic(prevTopic => ({
          ...prevTopic,
          vote_trend_data: chartData,
          vote_results: voteResults,
          total_vote: totalVote,
        }));
      }
    } finally {
      setChartLoading(false);
    }
  };

  const fetchComments = async () => {
    const result = await getComments(id);
    if (result) {
      setComments(result || []);
    } else {
      setComments([]);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchTopic();
    fetchTopicVotes('ALL');
    fetchComments();
  }, []);

  const handleTimeFrameClick = async (frame) => {
    if (frame !== selectedTimeFrame) {
      setSelectedTimeFrame(frame);
      await fetchTopicVotes(frame);
    }
  };

  const handleLikeClick = async () => {
    const result = await toggleTopicLike(id);
    if (result !== null) {
      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
    }
  };

  const handleVote = async (index) => {
    if (hasVoted) return;
    
    const success = await submitVote({
      topic_id: id,
      vote_index: index
    });

    if (success) {
      setHasVoted(true);
      setUserVoteIndex(index);
      await fetchTopic();
      await fetchTopicVotes(selectedTimeFrame);
    }
  };

  const handleSubmitComment = async (content) => {
    const result = await createComment(id, content);
    if (result) {
      await fetchComments();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const refreshComments = async () => {
    await fetchComments();
  };

  if (loading) {
    return <p className="text-center text-gray-500">로딩 중...</p>;
  }

  if (!topic) {
    return <p className="text-center text-gray-500">토픽을 찾을 수 없습니다.</p>;
  }

  const { title, description, created_at, vote_options, total_vote, vote_results } = topic;
  const voteData = topic.vote_trend_data;
  const optionCount = vote_options.length;
  const colors = voteColors[optionCount];

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8 border border-gray-200 transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-emerald-500">{title}</h1>
        <button
          onClick={handleLikeClick}
          className={classNames(
            "flex items-center space-x-2 text-lg font-semibold transition-all",
            liked ? "text-emerald-500" : "text-gray-500 hover:text-emerald-500"
          )}
        >
          <Heart 
            className={classNames(
              "w-7 h-7", 
              liked ? "fill-emerald-500" : "fill-none"
            )} 
          />
          <span>{likes}</span>
        </button>
      </div>

      <p className="text-gray-600 mb-6">{description}</p>

      <Chart
        topicId={id}
        voteOptions={vote_options}
        colors={colors}
        selectedTimeFrame={selectedTimeFrame}
        chartMetric={chartMetric}
        chartLoading={chartLoading}
        onTimeFrameChange={handleTimeFrameClick}
        onMetricChange={setChartMetric}
      />

      <div className="flex items-center text-gray-500 text-sm mt-6">
        <Calendar className="w-5 h-5 mr-2" />
        <span>{new Date(created_at).toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</span>
      </div>

      <div className="text-gray-600 text-lg flex items-center space-x-1 mt-2">
        <span className="font-semibold">총 투표 수:</span>
        <span className="font-bold text-emerald-600">{total_vote}</span>
      </div>

      <div className="space-y-4 my-6">
        {vote_options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleVote(index)}
            disabled={hasVoted}
            className={classNames(
              "w-full py-4 px-6 flex items-center justify-between rounded-lg text-lg font-medium transition-all duration-300",
              hasVoted
                ? userVoteIndex === index
                  ? "text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "hover:border-2 hover:border-opacity-100 border-2 border-opacity-50"
            )}
            style={{
              backgroundColor: hasVoted
                ? userVoteIndex === index
                  ? colors[index].bg
                  : "#E5E7EB"
                : "white",
              borderColor: hasVoted 
                ? "transparent" 
                : colors[index].bg,
            }}
          >
            <span>{option}</span>
            {hasVoted && (
              <div className="flex items-center gap-4">
                <span className={userVoteIndex === index ? "text-white" : "text-gray-600"}>
                  {vote_results[index]}표
                </span>
                <span className={userVoteIndex === index ? "text-white" : "text-gray-600"}>
                  {total_vote > 0
                    ? Math.round((vote_results[index] / total_vote) * 100)
                    : 0}
                  %
                </span>
                {userVoteIndex === index && (
                  <CheckCircle className="w-5 h-5" />
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      <Comments
        comments={paginatedData.currentPageData}
        currentPage={currentPage}
        totalPages={paginatedData.totalPages}
        onPageChange={handlePageChange}
        onSubmitComment={handleSubmitComment}
        loading={commentLoading}
        refreshComments={refreshComments}
      />
    </div>
  );
};

export default SingleTopic;
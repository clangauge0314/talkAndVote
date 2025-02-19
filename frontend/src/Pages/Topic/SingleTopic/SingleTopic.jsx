import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Heart, CheckCircle, Calendar } from "lucide-react";
import classNames from "classnames";
import { useTopic } from "../../../hooks/useTopic";
import { useLike } from "../../../hooks/useLike";
import { useVote } from "../../../hooks/useVote";
<<<<<<< HEAD
import { useComment } from '../../../hooks/useComment';
import Comments from './Comments';
=======
>>>>>>> a42dde08fa49e34f340a2277fca3f0ecb988d4c6

const timeFrames = ["1H", "6H", "1D", "1W", "1M", "ALL"];

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
<<<<<<< HEAD
  const { createComment, getComments } = useComment();
  const { toggleCommentLike } = useLike();
=======
>>>>>>> a42dde08fa49e34f340a2277fca3f0ecb988d4c6

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("ALL");
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVoteIndex, setUserVoteIndex] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
<<<<<<< HEAD
=======
    }
    setLoading(false);
  }, [id, getTopicById]);

  const fetchTopicVotes = async (frame) => {
    const voteData = await getTopicVotes(id, frame);
    if (voteData && topic) {
      const groupedData = voteData.reduce((acc, vote) => {
        const date = new Date(vote.created_at);
        let timeKey;
        
        switch(frame) {
          case '1H':
            timeKey = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            break;
          case '6H':
          case '1D':
            timeKey = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            break;
          case '1W':
            timeKey = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
            break;
          case '1M':
            timeKey = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
            break;
          default:
            timeKey = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        }

        if (!acc[timeKey]) {
          acc[timeKey] = {
            time: timeKey,
            votes_0: 0,
            votes_1: 0,
            votes_2: 0,
            votes_3: 0,
          };
        }
        acc[timeKey][`votes_${vote.vote_index}`]++;
        return acc;
      }, {});

      const chartData = Object.values(groupedData).sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });

      setTopic(prevTopic => ({
        ...prevTopic,
        vote_trend_data: chartData,
        vote_results: topic.vote_options.map((_, index) => 
          voteData.filter(vote => vote.vote_index === index).length
        ),
        total_vote: voteData.length,
      }));
    }
  };

  const fetchComments = async (page = 1) => {
    const commentsData = await getComments(id);
    if (commentsData) {
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      setComments(commentsData.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(commentsData.length / 10));
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    fetchTopic();
    fetchTopicVotes('ALL');
    fetchComments();
=======
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
      setLiked(topicData.is_liked);
>>>>>>> d8765c77792618cefff5402d82bbaf4b8646d030
    }
    setLoading(false);
  }, [id, getTopicById]);

  const fetchTopicVotes = async (frame) => {
    const voteData = await getTopicVotes(id, frame);
    if (voteData && topic) {
      const groupedData = voteData.reduce((acc, vote) => {
        const date = new Date(vote.created_at);
        let timeKey;
        
        switch(frame) {
          case '1H':
            timeKey = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            break;
          case '6H':
          case '1D':
            timeKey = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            break;
          case '1W':
            timeKey = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
            break;
          case '1M':
            timeKey = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
            break;
          default:
            timeKey = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        }

        if (!acc[timeKey]) {
          acc[timeKey] = {
            time: timeKey,
            votes_0: 0,
            votes_1: 0,
            votes_2: 0,
            votes_3: 0,
          };
        }
        acc[timeKey][`votes_${vote.vote_index}`]++;
        return acc;
      }, {});

      const chartData = Object.values(groupedData).sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });

      setTopic(prevTopic => ({
        ...prevTopic,
        vote_trend_data: chartData,
        vote_results: topic.vote_options.map((_, index) => 
          voteData.filter(vote => vote.vote_index === index).length
        ),
        total_vote: voteData.length,
      }));
    }
  };

  useEffect(() => {
    fetchTopic();
    fetchTopicVotes('ALL');
>>>>>>> a42dde08fa49e34f340a2277fca3f0ecb988d4c6
  }, [id]);

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

<<<<<<< HEAD
  const handleCommentSubmit = async (content) => {
    const result = await createComment(id, content);
    if (result) {
      await fetchComments(currentPage);
    }
  };

  const handleCommentLike = async (commentId) => {
    const result = await toggleCommentLike(commentId);
    if (result !== null) {
      await fetchComments(currentPage);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchComments(page);
  };

=======
>>>>>>> a42dde08fa49e34f340a2277fca3f0ecb988d4c6
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
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8 border border-gray-200 transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-emerald-500">{title}</h1>
        <button
          onClick={handleLikeClick}
          className={classNames(
            "flex items-center space-x-2 text-lg font-semibold transition-all",
            liked ? "text-emerald-500" : "text-gray-500 hover:text-emerald-500"
          )}
        >
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d8765c77792618cefff5402d82bbaf4b8646d030
          <Heart 
            className={classNames(
              "w-7 h-7", 
              liked ? "fill-emerald-500" : "fill-none"
            )} 
          />
<<<<<<< HEAD
=======
=======
          <Heart className={classNames("w-7 h-7", liked ? "fill-emerald-500" : "fill-none")} />
>>>>>>> a42dde08fa49e34f340a2277fca3f0ecb988d4c6
>>>>>>> d8765c77792618cefff5402d82bbaf4b8646d030
          <span>{likes}</span>
        </button>
      </div>

      <p className="text-gray-600 mb-6">{description}</p>

      <div className="bg-gray-100 rounded-lg p-5 shadow-inner mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">📊 투표 트렌드</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={topic.vote_trend_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip 
              formatter={(value, name) => {
                const optionIndex = name.split('_')[1];
                return [`${value}표`, vote_options[optionIndex]];
              }}
            />
            {vote_options.map((_, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={`votes_${index}`}
                name={`votes_${index}`}
                stroke={colors[index].bg}
                strokeWidth={2}
                dot={{ fill: colors[index].bg, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-3 mb-6">
        {timeFrames.map((frame) => (
          <button
            key={frame}
            onClick={() => handleTimeFrameClick(frame)}
            className={classNames(
              "px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200",
              selectedTimeFrame === frame
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                : "border-gray-300 hover:border-emerald-500"
            )}
          >
            {frame}
          </button>
        ))}
      </div>

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
<<<<<<< HEAD

      <Comments
        comments={comments}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSubmitComment={handleCommentSubmit}
        onLikeComment={handleCommentLike}
        loading={loading}
      />
=======
>>>>>>> a42dde08fa49e34f340a2277fca3f0ecb988d4c6
    </div>
  );
};

export default SingleTopic;

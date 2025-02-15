import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  const { getTopicById } = useTopic();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(
    searchParams.get("time_range") || "ALL"
  );
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVoteIndex, setUserVoteIndex] = useState(null);

  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      const topicData = await getTopicById(id, selectedTimeFrame.toLowerCase());
      if (topicData) {
        setTopic(topicData);
        setHasVoted(topicData.has_voted);
        setUserVoteIndex(topicData.user_vote_index);
        setLikes(topicData.like_count);
      }
      setLoading(false);
    };

    fetchTopic();
  }, [id, selectedTimeFrame]);

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
          onClick={() => {
            setLiked(!liked);
            setLikes(liked ? likes - 1 : likes + 1);
          }}
          className={classNames(
            "flex items-center space-x-2 text-lg font-semibold transition-all",
            liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          )}
        >
          <Heart className="w-7 h-7" />
          <span>{likes}</span>
        </button>
      </div>

      <p className="text-gray-600 mb-6">{description}</p>

      <div className="bg-gray-100 rounded-lg p-5 shadow-inner mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">📊 투표 트렌드</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={voteData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            {vote_results.map((_, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={`votes_${index}`}
                stroke={colors[index].bg}
                strokeWidth={3}
                dot={{ fill: colors[index].bg, r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-3 mb-6">
        {timeFrames.map((frame) => (
          <button
            key={frame}
            onClick={() => {
              setSelectedTimeFrame(frame);
              setSearchParams({ time_range: frame.toLowerCase() });
            }}
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

      <div className={`space-y-4 my-6 ${hasVoted ? "bg-gray-300 p-3 rounded-lg" : ""}`}>
        {vote_options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              if (!hasVoted) {
                setUserVoteIndex(index);
              }
            }}
            className={classNames(
              "w-full py-4 px-6 flex items-center justify-between rounded-lg text-lg font-medium border-2 transition-all duration-300",
              hasVoted
                ? userVoteIndex === index
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                  : "bg-gray-400 text-gray-200 border-gray-400 cursor-not-allowed"
                : "border-gray-300 hover:border-emerald-500"
            )}
            disabled={hasVoted}
          >
            {option}
            {hasVoted && userVoteIndex === index && <CheckCircle className="w-5 h-5" />}
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
          minute: "2-digit"
        })}</span>
      </div>

      <div className="text-gray-600 text-lg flex items-center space-x-1 mt-2">
        <span className="font-semibold">총 투표 수:</span>
        <span className="font-bold text-emerald-600">{total_vote}</span>
      </div>
    </div>
  );
};

export default SingleTopic;

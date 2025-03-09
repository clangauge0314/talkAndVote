import { useMemo, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import classNames from "classnames";
import { useTopic } from "../../../hooks/useTopic";

const timeFrames = ["1H", "6H", "1D", "1W", "1M", "ALL"];

const Chart = ({ topicId, voteOptions, colors }) => {
  const { getTopicVotes } = useTopic();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("ALL");
  const [chartMetric, setChartMetric] = useState('count');
  const [chartLoading, setChartLoading] = useState(false);
  const [voteData, setVoteData] = useState([]);

  const fetchTopicVotes = useCallback(async (frame) => {
    setChartLoading(true);
    try {
      const data = await getTopicVotes(topicId, frame);
      if (data) {
        const chartData = Object.entries(data).map(([_, data]) => ({
          time: data.formattedTime,
          ...Object.entries(data).reduce((obj, [idx, values]) => {
            if (typeof values === 'object' && values.count !== undefined) {
              return {
                ...obj,
                [`count_${idx}`]: values.count || 0,
                [`percent_${idx}`]: values.percent || 0
              };
            }
            return obj;
          }, {})
        }));
        setVoteData(chartData);
      }
    } finally {
      setChartLoading(false);
    }
  }, [topicId, getTopicVotes]);

  const handleTimeFrameClick = useCallback((frame) => {
    if (frame !== selectedTimeFrame) {
      setSelectedTimeFrame(frame);
      fetchTopicVotes(frame);
    }
  }, [selectedTimeFrame, fetchTopicVotes]);

  const chartComponent = useMemo(() => (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={voteData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time"
          tick={{ fontSize: 12 }}
          interval={Math.ceil((voteData?.length || 0) / 6)}
          minTickGap={50}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          domain={chartMetric === 'percent' ? [0, 100] : ['auto', 'auto']}
          tickFormatter={(value) => chartMetric === 'percent' ? `${value}%` : value}
        />
        <Tooltip 
          formatter={(value, name) => {
            const optionIndex = name.split('_')[1];
            return [
              chartMetric === 'percent' ? `${value}%` : value,
              voteOptions[optionIndex]
            ];
          }}
        />
        {voteOptions.map((_, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={`${chartMetric}_${index}`}
            name={`option_${index}`}
            stroke={colors[index].bg}
            strokeWidth={2}
            dot={false}
            connectNulls={true}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  ), [voteData, voteOptions, colors, chartMetric]);

  const timeFrameButtons = useMemo(() => (
    <div className="flex justify-center space-x-3 mb-6">
      {timeFrames.map((frame) => (
        <button
          key={frame}
          onClick={() => handleTimeFrameClick(frame)}
          disabled={chartLoading}
          className={classNames(
            "px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200",
            selectedTimeFrame === frame
              ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
              : chartLoading
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 hover:border-emerald-500"
          )}
        >
          {frame}
        </button>
      ))}
    </div>
  ), [selectedTimeFrame, chartLoading, handleTimeFrameClick]);

  return (
    <>
      <div className="bg-gray-100 rounded-lg p-5 shadow-inner mb-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">📊 투표 트렌드</h2>
          <select
            value={chartMetric}
            onChange={(e) => setChartMetric(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
            disabled={chartLoading}
          >
            <option value="count">투표 수</option>
            <option value="percent">백분율 (%)</option>
          </select>
        </div>
        
        {chartLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
            <p className="text-gray-600 font-medium">로딩 중...</p>
          </div>
        )}
        
        {chartComponent}
      </div>
      {timeFrameButtons}
    </>
  );
};

export default Chart;

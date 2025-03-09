import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const useTopic = () => {
    const [loading, setLoading] = useState(false);

    const handleAuthError = async (error) => {
        if (error.response?.status === 401) {
            await Swal.fire({
                title: '로그인이 필요합니다!',
                text: '이 페이지를 이용하려면 로그인하세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return true;
        }
        return false;
    };

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics`, { withCredentials: true });

            if (response.status === 200 && response.data) {
                return response.data;
            } else {
                Swal.fire({
                    icon: "error",
                    title: "예기치 않은 응답",
                    text: `서버에서 예상하지 못한 응답을 반환했습니다. (${response.status})`,
                    confirmButtonColor: "#EF4444",
                });
                return null;
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: error.response?.data?.error || "토픽을 불러올 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });

            return null;
        } finally {
            setLoading(false);
        }
    };

    const getTopicById = async (topicId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/topic/${topicId}`, { withCredentials: true });

            if (response.status === 200 && response.data) {
                return response.data;
            } else {
                Swal.fire({
                    icon: "error",
                    title: "예기치 않은 응답",
                    text: `서버에서 예상하지 못한 응답을 반환했습니다. (${response.status})`,
                    confirmButtonColor: "#EF4444",
                });
                return null;
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: error.response?.data?.error || "토픽을 불러올 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });

            return null;
        } finally {
            setLoading(false);
        }
    };

    const getTopicVotes = async (topicId, timeRange = "ALL") => {
        try {            
            const convertedTimeRange = timeRange === "1M" ? "30d" : timeRange;
            const timeRangeParam = convertedTimeRange === "ALL" 
                ? "" 
                : `time_range=${convertedTimeRange.toLowerCase()}`;
            
            let interval;
            switch (timeRange) {
                case '1H': interval = '1m'; break;
                case '6H': interval = '1m'; break;
                case '1D': interval = '5m'; break;
                case '1W': interval = '30m'; break;
                case '1M': interval = '3h'; break;
                case 'ALL': interval = '12h'; break;
                default: interval = '1m';
            }
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/vote/topic/${topicId}?${timeRangeParam}&interval=${interval}`
            );

            if (response.status === 200 && response.data) {
                const formattedData = Object.entries(response.data).reduce((acc, [timestamp, data]) => {
                    const date = new Date(timestamp);
                    const formattedTime = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                    acc[timestamp] = data;
                    acc[timestamp].formattedTime = formattedTime;
                    return acc;
                }, {});

                return formattedData;
            } else {
                Swal.fire({
                    icon: "error",
                    title: "예기치 않은 응답",
                    text: `서버에서 예상하지 못한 응답을 반환했습니다. (${response.status})`,
                    confirmButtonColor: "#EF4444",
                });
                return null;
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: error.response?.data?.error || "투표 데이터를 불러올 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });

            return null;
        }
    };

    const addTopic = async (topicData) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/topic`,
                topicData,
                { withCredentials: true }
            );

            if (response.status === 200) {
                return response.data;
            } else {
                Swal.fire({
                    icon: "error",
                    title: "예기치 않은 응답",
                    text: `서버에서 예상하지 못한 응답을 반환했습니다. (${response.status})`,
                    confirmButtonColor: "#EF4444",
                });
                return null;
            }
        } catch (error) {
            if (await handleAuthError(error)) return;

            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: error.response?.data?.error || "토픽을 생성할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        addTopic,
        fetchTopics,
        getTopicById,
        getTopicVotes
    };
};
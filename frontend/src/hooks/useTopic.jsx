import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const useTopic = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuthError = async (error) => {
        if (error.response?.status === 401) {
            await logout();
            navigate('/login');
            return true;
        }
        return false;
    };

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/topics`, { withCredentials: true });

            if (response.status === 200 && response.data) {
                console.log(response.data)
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
                console.log(response.data)
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
        getTopicById
    };
};
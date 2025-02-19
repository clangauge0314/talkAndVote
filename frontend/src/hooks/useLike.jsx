import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const useLike = () => {
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

    const toggleTopicLike = async (topicId) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/like/topic/${topicId}`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                const isLiked = response.data.is_liked;
                Swal.fire({
                    icon: "success",
                    title: "좋아요 처리 완료",
                    text: isLiked ? "토픽에 좋아요를 표시했습니다." : "토픽 좋아요를 취소했습니다.",
                    confirmButtonColor: "#34D399",
                });
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
                text: error.response?.data?.error || "좋아요를 처리할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const toggleCommentLike = async (commentId) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/like/comment/${commentId}`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                const isLiked = response.data.is_liked;
                Swal.fire({
                    icon: "success",
                    title: "좋아요 처리 완료",
                    text: isLiked ? "댓글에 좋아요를 표시했습니다." : "댓글 좋아요를 취소했습니다.",
                    confirmButtonColor: "#34D399",
                });
                return response.data;
            }
            return null;
        } catch (error) {
            if (await handleAuthError(error)) return null;

            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: error.response?.data?.error || "좋아요를 처리할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const toggleReplyLike = async (replyId) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/like/reply/${replyId}`,
                {},
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
                text: error.response?.data?.error || "좋아요를 처리할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        toggleTopicLike,
        toggleCommentLike,
        toggleReplyLike
    };
};

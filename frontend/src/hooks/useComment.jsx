import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const useComment = () => {
    const [loading, setLoading] = useState(false);

    const handleAuthError = async (error) => {
        if (error.response.status === 401) {
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

    const createComment = async (topicId, content) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/comment`,
                { topic_id: topicId, content },
                { withCredentials: true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "댓글 작성 완료",
                    text: "댓글이 성공적으로 작성되었습니다.",
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
                text: error.response?.data?.error || "댓글을 작성할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getComments = async (topicId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/comment/${topicId}`,
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
                text: error.response?.data?.error || "댓글을 불러올 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteComment = async (commentId) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/comment/${commentId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "댓글 삭제 완료",
                    text: "댓글이 성공적으로 삭제되었습니다.",
                    confirmButtonColor: "#34D399",
                });
                return true;
            } else {
                Swal.fire({
                    icon: "error",
                    title: "예기치 않은 응답",
                    text: `서버에서 예상하지 못한 응답을 반환했습니다. (${response.status})`,
                    confirmButtonColor: "#EF4444",
                });
                return false;
            }
        } catch (error) {
            if (await handleAuthError(error)) return;

            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: error.response?.data?.detail || "댓글을 삭제할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createComment,
        getComments,
        deleteComment
    };
};

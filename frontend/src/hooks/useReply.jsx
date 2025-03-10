import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const useReply = () => {
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

    const createReply = async (commentId, content) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/reply`,
                { comment_id: commentId, content },
                { withCredentials: true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "답글 작성 완료",
                    text: "답글이 성공적으로 작성되었습니다.",
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
                text: error.response?.data?.error || "답글을 작성할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteReply = async (replyId) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/reply/${replyId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "답글 삭제 완료",
                    text: "답글이 성공적으로 삭제되었습니다.",
                    confirmButtonColor: "#34D399",
                });
                return true;
            }
            return false;
        } catch (error) {
            if (await handleAuthError(error)) return false;

            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: error.response?.data?.error || "답글을 삭제할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateReply = async (replyId, content) => {
        setLoading(true);
        alert(replyId, content);    
        try {

            console.log(replyId, content);
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/reply`,
                { reply_id: replyId, content },
                { withCredentials: true }
            );

            

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "답글 수정 완료",
                    text: "답글이 성공적으로 수정되었습니다.",
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
                text: error.response?.data?.error || "답글을 수정할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createReply,
        deleteReply,
        updateReply
    };
};

import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const useVote = () => {
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

    const submitVote = async ({ topic_id, vote_index }) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/vote`,
                { topic_id, vote_index },
                { withCredentials: true }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "투표 완료",
                    text: "성공적으로 투표되었습니다.",
                    confirmButtonColor: "#22C55E",
                });
                return true;
            } else {
                Swal.fire({
                    icon: "error",
                    title: "투표 실패",
                    text: response.data.message || "투표를 처리하는 중 오류가 발생했습니다.",
                    confirmButtonColor: "#EF4444",
                });

                return false;
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "오류 발생",
                text: error.response?.data?.error || "투표를 진행할 수 없습니다.",
                confirmButtonColor: "#EF4444",
            });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        submitVote
    };
};
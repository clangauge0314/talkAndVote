import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthError = async (error) => {
    if (error.response?.status === 401) {
      await logout();
      navigate('/login');
      return true;
    }
    return false;
  };

  const getMyProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/profile/`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (await handleAuthError(error)) return;
      setError(error.response?.data?.error || '프로필을 불러오는데 실패했습니다.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (username) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/profile/${username}/`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (await handleAuthError(error)) return;
      setError(error.response?.data?.error || '프로필을 불러오는데 실패했습니다.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profile/`,
        profileData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      setUser(response.data);
      Swal.fire({
        icon: 'success',
        title: '프로필 수정 완료',
        text: '프로필이 성공적으로 수정되었습니다.',
        confirmButtonColor: '#34D399',
      });
      return response.data;
    } catch (error) {
      if (await handleAuthError(error)) return;
      Swal.fire({
        icon: 'error',
        title: '프로필 수정 실패',
        text: error.response?.data?.error || '프로필 수정에 실패했습니다.',
        confirmButtonColor: '#34D399',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      const result = await Swal.fire({
        title: '정말 탈퇴하시겠습니까?',
        text: "이 작업은 되돌릴 수 없습니다!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '탈퇴하기',
        cancelButtonText: '취소'
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/auth/profile/`,
          { withCredentials: true }
        );
        
        await logout();
        Swal.fire({
          title: '탈퇴 완료',
          text: '계정이 성공적으로 삭제되었습니다.',
          icon: 'success',
          confirmButtonColor: '#34D399',
        });
        
        navigate('/');
      }
    } catch (error) {
      if (await handleAuthError(error)) return;
      Swal.fire({
        icon: 'error',
        title: '탈퇴 실패',
        text: error.response?.data?.error || '계정 삭제에 실패했습니다.',
        confirmButtonColor: '#34D399',
      });
      throw error;
    }
  };

  return {
    loading,
    error,
    getMyProfile,
    getUserProfile,
    updateProfile,
    deleteAccount,
  };
};
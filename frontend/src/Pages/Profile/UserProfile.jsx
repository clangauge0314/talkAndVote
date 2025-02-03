import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { format } from 'date-fns';

export default function UserProfile() {
  const { username } = useParams();
  const { loading, getUserProfile } = useProfile();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(username);
        setProfile(data);
      } catch (error) {
        console.error('프로필 로딩 실패:', error);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">사용자를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {profile.username}의 프로필
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <p className="mt-1 text-lg text-gray-900">
              {profile.first_name} {profile.last_name}
            </p>
          </div>

          {profile.date_of_birth && (
            <div>
              <label className="block text-sm font-medium text-gray-700">생년월일</label>
              <p className="mt-1 text-lg text-gray-900">
                {format(new Date(profile.date_of_birth), 'yyyy년 MM월 dd일')}
              </p>
            </div>
          )}

          {profile.gender && (
            <div>
              <label className="block text-sm font-medium text-gray-700">성별</label>
              <p className="mt-1 text-lg text-gray-900">
                {profile.gender === 'male' ? '남성' : '여성'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
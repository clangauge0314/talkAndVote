import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { useSelector } from 'react-redux';
import PaymentModal from '../../Components/Modal/PaymentModal/PaymentModal';

const MembershipCard = ({ title, color, price, topics, features, onSubscribe, currentGrade }) => {
  
  return (
    <div className={`p-6 rounded-lg shadow-xl transition-transform hover:scale-105 ${color} max-w-sm w-full mx-auto flex flex-col h-full`}>
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
          <p className="text-3xl font-bold text-white">{price}</p>
          <p className="text-white/80">월</p>
        </div>
        <div className="text-white/90 mb-6">
          <p className="mb-2">토픽 생성: {topics}</p>
          {features.map((feature, index) => (
            <p key={index} className="mb-1 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              {feature}
            </p>
          ))}
        </div>
      </div>

      
      
      {currentGrade?.toLowerCase() === title.toLowerCase() ? (
        <button 
          disabled
          className="w-full py-2 px-4 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
        >
          현재 구독 중
        </button>
      ) : (
        <button 
          onClick={() => onSubscribe(title, price)}
          className="w-full py-2 px-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-opacity-90 transition-colors mt-auto"
        >
          구독하기
        </button>
      )}
    </div>
  );
};

const ComparisonTable = () => {
  const features = [
    { name: '토픽 생성', bronze: '월 1회', silver: '월 3회', gold: '월 6회', vip: '무제한' },
    { name: '댓글 기능', bronze: '⭕', silver: '⭕', gold: '⭕', vip: '⭕' },
    { name: '맴버십 뱃지', bronze: '❌', silver: '실버', gold: '골드', vip: 'VIP' },
    { name: '1:1 상담', bronze: '❌', silver: '❌', gold: '❌', vip: '⭕' },
  ];

  return (
    <div className="overflow-x-auto mt-16 mb-8">
      <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left border-b">기능</th>
            <th className="p-4 text-center border-b">
              <span className="text-amber-800">브론즈</span>
            </th>
            <th className="p-4 text-center border-b">
              <span className="text-gray-600">실버</span>
            </th>
            <th className="p-4 text-center border-b">
              <span className="text-yellow-600">골드</span>
            </th>
            <th className="p-4 text-center border-b">
              <span className="text-emerald-600">VIP</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="p-4 border-b font-medium">{feature.name}</td>
              <td className="p-4 text-center border-b">{feature.bronze}</td>
              <td className="p-4 text-center border-b">{feature.silver}</td>
              <td className="p-4 text-center border-b">{feature.gold}</td>
              <td className="p-4 text-center border-b">{feature.vip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Membership = () => {
  const { verifyJWT } = useAuth();
  const membershipGrade = useSelector(state => state.membership.grade);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      await verifyJWT(true);
    };
    checkAuth();
  }, []);

  const memberships = [
    {
      title: '브론즈',
      color: 'bg-gradient-to-br from-amber-700 to-amber-900',
      price: '무료',
      topics: '월 1회',
      features: ['기본 댓글 기능', '브론즈 뱃지 제공']
    },
    {
      title: '실버',
      color: 'bg-gradient-to-br from-gray-400 to-gray-600',
      price: '무료',
      topics: '월 3회',
      features: ['모든 브론즈 혜택', '실버 뱃지 제공']
    },
    {
      title: '골드',
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
      price: '₩1,000',
      topics: '월 6회',
      features: ['모든 실버 혜택', '골드 뱃지 제공']
    },
    {
      title: 'VIP',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
      price: '₩1,000',
      topics: '무제한',
      features: ['모든 골드 혜택', 'VIP 뱃지 제공', '1:1 상담 지원']
    }
  ];

  const handleSubscribe = (title, price) => {
    setSelectedPlan({ title, price });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">멤버십 플랜</h1>
      {membershipGrade && (
        <p className="text-center text-emerald-600 mb-4">
          현재 회원님의 멤버십 등급은 <span className="font-bold">{membershipGrade}</span> 입니다
        </p>
      )}
      <p className="text-center text-gray-600 mb-12">당신에게 맞는 완벽한 플랜을 선택하세요</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {memberships.map((membership, index) => (
          <MembershipCard 
            key={index} 
            {...membership} 
            onSubscribe={handleSubscribe}
            currentGrade={membershipGrade}
          />
        ))}
      </div>
      <ComparisonTable />
      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default Membership
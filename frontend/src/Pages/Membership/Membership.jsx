import React from 'react'

const MembershipCard = ({ title, color, price, topics, features }) => {
  return (
    <div className={`p-6 rounded-lg shadow-xl transition-transform hover:scale-105 ${color} max-w-sm w-full mx-auto`}>
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
      <button className="w-full py-2 px-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
        구독하기
      </button>
    </div>
  );
};

const Membership = () => {
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
      price: '₩5,000',
      topics: '월 3회',
      features: ['모든 브론즈 혜택', '실버 뱃지 제공', '우선 답변']
    },
    {
      title: '골드',
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
      price: '₩10,000',
      topics: '월 6회',
      features: ['모든 실버 혜택', '골드 뱃지 제공', '프리미엄 지원']
    },
    {
      title: 'VIP',
      color: 'bg-gradient-to-br from-purple-600 to-purple-800',
      price: '₩20,000',
      topics: '무제한',
      features: ['모든 골드 혜택', 'VIP 뱃지 제공', '전용 고객 지원', '특별 이벤트 초대']
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">멤버십 플랜</h1>
      <p className="text-center text-gray-600 mb-12">당신에게 맞는 완벽한 플랜을 선택하세요</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {memberships.map((membership, index) => (
          <MembershipCard key={index} {...membership} />
        ))}
      </div>
    </div>
  );
};

export default Membership
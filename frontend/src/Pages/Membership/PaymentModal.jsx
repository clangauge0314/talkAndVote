import React from 'react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiToss } from 'react-icons/si';
import { IoCloseOutline } from 'react-icons/io5';

const PaymentModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;

  const handlePayment = (method) => {
    console.log(`Processing ${method} payment for ${plan.title} plan`);
    // TODO: Implement actual payment logic
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">결제 수단 선택</h2>
        <p className="text-gray-600 mb-6">
          {plan?.title} 멤버십 ({plan?.price})
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handlePayment('toss')}
            className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <SiToss className="w-6 h-6" />
            <span>토스페이로 결제하기</span>
          </button>

          <button
            onClick={() => handlePayment('kakao')}
            className="w-full flex items-center justify-center space-x-2 bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <RiKakaoTalkFill className="w-6 h-6" />
            <span>카카오페이로 결제하기</span>
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          결제 진행 시 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
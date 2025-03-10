import PortOne from "@portone/browser-sdk/v2";
import { useState } from "react";
import axios from "axios";

function randomId() {
  return Array.from(crypto.getRandomValues(new Uint32Array(2)))
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("");
}

const PaymentModal = ({ isOpen, onClose, selectedPlan }) => {
  const [paymentStatus, setPaymentStatus] = useState({
    status: "IDLE",
  });

  const handlePayment = async (e) => {
    try {
      e.preventDefault();
      console.log('Payment process started:', { selectedPlan });
      
      setPaymentStatus({ status: "PENDING" });
      const paymentId = randomId();
      console.log('Generated paymentId:', paymentId);

      const price =
        selectedPlan.price === "무료"
          ? 0
          : parseInt(selectedPlan.price.replace(/[^0-9]/g, ""));
      console.log('Calculated price:', price);

      console.log('PortOne Config:', {
        storeId: import.meta.env.VITE_STORE_ID,
        channelKey: import.meta.env.VITE_CHANNEL_KEY,
      });

      const payment = await PortOne.requestPayment({
        storeId: import.meta.env.VITE_STORE_ID,
        channelKey: import.meta.env.VITE_CHANNEL_KEY,
        paymentId,
        orderName: `${selectedPlan.title} Membership Subscription`,
        totalAmount: price,
        currency: "KRW",
        payMethod: "CARD",
        customer: {
          fullName: 'Subscriber',
          email: 'subscriber@example.com',
          phoneNumber: '01012341234'
        },
        customData: {
          membershipGrade: selectedPlan.title.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ''),
        },
      }).catch(error => {
        console.error('PortOne requestPayment error:', error);
        throw new Error('포트원 결제 요청 중 오류가 발생했습니다.');
      });

      console.log('PortOne payment response:', payment);

      if (payment.code != null) {
        console.error('Payment failed with code:', payment.code, payment.message);
        setPaymentStatus({
          status: "FAILED",
          message: `결제 실패: ${payment.message || '알 수 없는 오류가 발생했습니다.'}`,
        });
        return;
      }

      console.log('Sending payment completion request to backend:', {
        paymentId: payment.paymentId,
        apiUrl: `${import.meta.env.VITE_API_URL}/api/payment/complete`,
      });

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/complete`, 
        null, 
        {
          params: {
            payment_id: payment.paymentId, 
          },
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, 
        }
      ).catch(error => {
        console.error('Backend API error:', error.response || error);
        throw new Error('서버 통신 중 오류가 발생했습니다.');
      });

      console.log('Backend response:', data);
      
      setPaymentStatus({
        status: data.status,
      });
    } catch (error) {
      console.error('Payment process error:', error);
      setPaymentStatus({
        status: "FAILED",
        message: error.message || "결제 처리 중 오류가 발생했습니다.",
      });
    }
  };

  const handleClose = () => {
    setPaymentStatus({ status: "IDLE" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">멤버십 구독 결제</h2>

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{selectedPlan.title} 멤버십</h3>
            <p className="text-gray-600">구독 가격: {selectedPlan.price}/월</p>
          </div>
        </div>

        {paymentStatus.status === "FAILED" && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {paymentStatus.message}
          </div>
        )}

        {paymentStatus.status === "PAID" && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            결제가 완료되었습니다.
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            취소
          </button>
          {paymentStatus.status === "IDLE" && (
            <button
              onClick={handlePayment}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={selectedPlan.price === "무료"}
            >
              결제하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

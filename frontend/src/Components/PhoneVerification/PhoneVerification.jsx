import React, { useState } from "react";
import Modal from "react-modal";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import axios from "axios";

Modal.setAppElement("#root");

const PhoneVerificationModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!phone.startsWith("82")) {
      setError("한국의 +82 번호만 가능합니다.");
      return;
    }

    try {
      setError("");
    //   const response = await axios.post(
    //     `${import.meta.env.VITE_API_URL}/auth/send-otp/`,
    //     { phone }
    //   );
    //   if (response.status === 200) {
    //     setStep(2);
    //   }
    } catch (err) {
      setError("OTP 전송 중 오류가 발생했습니다.");
    }
  };

  const verifyOtp = async () => {
    // try {
    //   setError("");
    //   const response = await axios.post(
    //     `${import.meta.env.VITE_API_URL}/auth/verify-otp/`,
    //     { phone, otp }
    //   );
    //   if (response.status === 200) {
    //     alert("휴대폰 인증이 완료되었습니다!");
    //     onClose();
    //   }
    // } catch (err) {
    //   setError("OTP 인증에 실패했습니다. 다시 시도해주세요.");
    // }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-xl shadow-xl max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold text-center mb-4">휴대폰 인증</h2>
      {step === 1 && (
        <div>
          <PhoneInput
            country={"kr"}
            value={phone}
            onChange={(value) => setPhone(value)}
            onlyCountries={["kr"]}
            countryCodeEditable={false}
            placeholder="휴대폰 번호를 입력하세요"
            inputClass="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={sendOtp}
            className="w-full mt-4 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600"
          >
            인증번호 보내기
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="인증번호를 입력하세요"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={verifyOtp}
            className="w-full mt-4 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600"
          >
            인증하기
          </button>
        </div>
      )}
      <button
        onClick={onClose}
        className="w-full mt-4 text-gray-500 underline text-sm"
      >
        닫기
      </button>
    </Modal>
  );
};

export default PhoneVerificationModal;

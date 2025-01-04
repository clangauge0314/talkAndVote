import axios from "axios";

export const login = async (email, password) => {
  // 에러 핸들링을 위해 try-catch 블록 사용
  try {
    // POST 요청 보내기
    const response = await axios(
      `${import.meta.env.VITE_API_URL}/auth/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    // 응답이 성공적인지 확인
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 응답 데이터 반환
    const data = await response.json();
    return data;
  } catch (error) {
    // 에러 처리
    console.error("Login failed:", error);
    throw error;
  }
};

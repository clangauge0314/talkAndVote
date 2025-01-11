<<<<<<< HEAD
export const login = async (email, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
=======
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
>>>>>>> 9d1384845d784f7a4f686b2afd25ca4f1b633ba8

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const signup = async (email, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

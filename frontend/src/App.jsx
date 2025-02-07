import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth, AuthProvider } from "./hooks/useAuth";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import LoginModal from "./Components/Modal/LoginModal/LoginModal";
import SignupModal from "./Components/Modal/SignupModal/SignupModal";

import Main from "./Pages/Main/Main";
import Profile from "./Pages/Profile/Profile";
import UserProfile from "./Pages/Profile/UserProfile";
import CreateTopic from "./Pages/Topic/CreateTopic/CreateTopic";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAlert(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    if (showAlert) {
      alert("로그인이 필요한 서비스입니다. 로그인 후 진행해주세요.");
      return <Navigate to="/" replace />;
    }
    return null; 
  }

  return children;
};

const Layout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} onSignupClick={() => setIsSignupOpen(true)} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route
            path="/create-topic"
            element={
              <ProtectedRoute>
                <CreateTopic />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSignupClick={() => setIsSignupOpen(true)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} onLoginClick={() => setIsLoginOpen(true)} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

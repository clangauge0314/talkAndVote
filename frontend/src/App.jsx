import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import LoginModal from "./Components/Modal/LoginModal/LoginModal";
import SignupModal from "./Components/Modal/SignupModal/SignupModal";

import Main from "./Pages/Main/Main";
import Profile from "./Pages/Profile/Profile";
import UserProfile from "./Pages/Profile/UserProfile";
import CreateTopic from "./Pages/Topic/CreateTopic/CreateTopic";
import SingleTopic from "./Pages/Topic/SingleTopic/SingleTopic";

import Membership from "./Pages/Membership/Membership";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    alert("로그인이 필요한 서비스입니다. 로그인 후 진행해주세요.");
    return <Navigate to="/" replace />;
  }

  return children;
};

const Layout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLoginClick = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const handleSignupClick = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleCloseModals = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={handleCloseModals}
        onSignupClick={handleSignupClick}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={handleCloseModals}
        onLoginClick={handleLoginClick}
      />
    </>
  );
};

const AppWithProvider = () => {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWithProvider />,
    children: [
      { index: true, element: <Main /> },
      { path: "profile", element: <Profile /> },
      { path: "profile/:username", element: <UserProfile /> },
      {
        path: "create-topic",
        element: (
          <ProtectedRoute>
            <CreateTopic />
          </ProtectedRoute>
        ),
      },
      { path: "topic/:id", element: <SingleTopic /> },
      {
        path: "membership",
        element: (
          <ProtectedRoute>
            <Membership />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

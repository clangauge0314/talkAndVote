import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "./hooks/useAuth";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import LoginModal from "./Components/Modal/LoginModal/LoginModal";
import SignupModal from "./Components/Modal/SignupModal/SignupModal";

import Main from "./Pages/Main/Main";
import Profile from "./Pages/Profile/Profile";
import UserProfile from "./Pages/Profile/UserProfile";

const Layout = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const closeModal = (setModalState) => {
    setModalState(false);
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar
          onLoginClick={() => setIsLoginOpen(true)}
          onSignupClick={() => setIsSignupOpen(true)}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => closeModal(setIsLoginOpen)}
          onSignupClick={openSignup}
        />
        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => closeModal(setIsSignupOpen)}
          onLoginClick={openLogin}
        />
      </div>
    </AuthProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Main />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/:username",
        element: <UserProfile />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

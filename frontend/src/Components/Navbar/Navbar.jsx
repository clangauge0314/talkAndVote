import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BiSearch, BiTrendingUp } from "react-icons/bi";
import { MdDashboard, MdLocalActivity } from "react-icons/md";

function Navbar({ onLoginClick, onSignupClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const categoriesRef = useRef(null);

  const categories = [
    "전체",
    "최신",
    "정치",
    "경제",
    "암호화폐",
    "스포츠",
    "IT",
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <nav className="bg-emerald-500">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-20">
          <div className="flex items-center flex-1">
            <Link to="/" className="text-white font-bold text-xl flex-shrink-0">
              TalkAndVote
            </Link>
            
            <div className="hidden xl:flex items-center ml-8 flex-1">
              <div className="relative flex-1 max-w-6xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-emerald-100 text-emerald-900 placeholder-emerald-500 hover:bg-white hover:text-emerald-900 hover:placeholder-emerald-400 sm:text-sm transition-all duration-500"
                  placeholder="주제 검색하기..."
                />
              </div>

              <div className="flex items-center ml-8 space-x-8">
                <Link
                  to="/dashboard"
                  className="flex flex-col items-center text-white hover:text-gray-200 transition-all duration-500"
                >
                  <MdDashboard className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">대시보드</span>
                </Link>
                <Link
                  to="/activity"
                  className="flex flex-col items-center text-white hover:text-gray-200 transition-all duration-500"
                >
                  <MdLocalActivity className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">활동내역</span>
                </Link>
                <Link
                  to="/ranking"
                  className="flex flex-col items-center text-white hover:text-gray-200 transition-all duration-500"
                >
                  <BiTrendingUp className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">랭킹</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-emerald-600"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center ml-8">
            <button
              onClick={onLoginClick}
              className="text-white hover:bg-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-500"
            >
              로그인
            </button>
            <button
              onClick={onSignupClick}
              className="ml-4 text-emerald-500 bg-white hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-500"
            >
              회원가입
            </button>
          </div>
        </div>

        <div 
          className={`md:hidden transform transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0 bg-emerald-500' : 'opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative max-w-6xl mx-auto mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-emerald-100 text-emerald-900 placeholder-emerald-500 hover:bg-white hover:text-emerald-900 hover:placeholder-emerald-400 sm:text-sm transition-all duration-500"
                placeholder="주제 검색하기..."
              />
            </div>
            
            <div className="pb-2 mb-2">
              <Link
                to="/dashboard"
                className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-500"
              >
                대시보드
              </Link>
              <Link
                to="/activity"
                className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-500"
              >
                활동내역
              </Link>
              <Link
                to="/ranking"
                className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-500"
              >
                랭킹
              </Link>
            </div>

            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick();
                }}
                className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-500 text-left"
              >
                로그인
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onSignupClick();
                }}
                className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-500 text-left"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-2">
        <div
          ref={categoriesRef}
          className="flex overflow-x-auto scrollbar-hide max-w-full mx-auto px-4 sm:px-6 lg:px-8"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="flex space-x-4 py-2 whitespace-nowrap">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 text-white hover:bg-emerald-600 rounded-md transition-all duration-500 text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

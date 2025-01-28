import React from 'react'

const Main = () => {
  const popularTopics = [
    "웹개발",
    "AI/ML",
    "모바일앱",
    "데이터사이언스",
    "클라우드"
  ];

  const dummyCards = Array(12).fill().map((_, index) => ({
    id: index + 1,
    title: [
      "ChatGPT를 뛰어넘는 AI가 등장할 수 있을까?",
      "React vs Vue, 프론트엔드의 미래는?",
      "앱 개발, Flutter vs React Native 어떤 것이 더 효율적일까?",
      "빅데이터는 개인정보 침해를 정당화할 수 있는가?",
      "클라우드 서비스, AWS의 독점은 계속될 것인가?",
      "노코드 도구는 개발자의 일자리를 위협할까?",
      "블록체인 기술은 금융의 미래가 될 수 있을까?",
      "메타버스는 실패한 기술인가?",
      "양자 컴퓨팅, 현실적인 활용 시기는?",
      "AI 윤리 가이드라인, 누가 제정해야 하는가?",
      "디지털 화폐가 법정화폐를 대체할 수 있을까?",
      "자율주행 자동차, 사고의 책임은 누구에게 있는가?"
    ][index],
    createdAt: '2024-03-20',
    votesCount: Math.floor(Math.random() * 100),
    commentsCount: Math.floor(Math.random() * 50),
    bookmarks: Math.floor(Math.random() * 30),
    agreePercentage: Math.floor(Math.random() * 100),
  }));

  return (
    <div className="w-full px-4 py-4 bg-white">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex gap-3 flex-wrap">
            {popularTopics.map((topic, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-sm"
              >
                {topic}
              </button>
            ))}
          </div>
          
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all duration-200">
              필터
            </button>
            <select className="px-4 py-2 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="latest">최신순</option>
              <option value="popular">인기순</option>
              <option value="views">조회순</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dummyCards.map((card) => (
            <div
              key={card.id}
              className="border border-emerald-100 rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-white flex flex-col h-[230px]"
            >
              <h3 className="text-base font-semibold mb-4 text-emerald-900 line-clamp-2 h-[48px]">
                {card.title}
              </h3>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-blue-500">찬성 {card.agreePercentage}%</span>
                  <span className="text-red-500">반대 {100 - card.agreePercentage}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden relative">
                  <div className="absolute w-full h-full bg-red-200"></div>
                  <div className="absolute h-full bg-blue-200"
                    style={{ 
                      width: `${card.agreePercentage}%`,
                    }}
                  ></div>
                  <div className="absolute h-full bg-blue-500 opacity-40"
                    style={{ 
                      width: `${card.agreePercentage}%`,
                    }}
                  ></div>
                  <div className="absolute h-full bg-red-500 opacity-40"
                    style={{ 
                      left: `${card.agreePercentage}%`,
                      width: `${100 - card.agreePercentage}%`,
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="flex gap-2 mb-2">
                <button className="flex-1 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200">
                  찬성
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200">
                  반대
                </button>
              </div>

              <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
                <span>{card.createdAt}</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-users"></i>
                    {card.votesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-comment"></i>
                    {card.commentsCount}
                  </span>
                  <button className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
                    <i className="fas fa-star"></i>
                    {card.bookmarks}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Main
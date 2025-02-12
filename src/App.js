import logo from './logo.svg';
import InterPage from './InterPage.js';
import InfoCard from './InfoCard.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<p>홈인데요. 여긴 아무것도 없어요.<br /> 3일에 페이지 하나씩 만들라는 기획자가 있다...? <br/> by 홍석주</p>} />
          <Route path="/:username/inter" element={<InterPage />} />
          <Route path="/:username/info" element={<InfoCard />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;


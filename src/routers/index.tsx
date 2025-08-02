import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Detail from "./Detail";
import OnBoarding from "./OnBoarding";

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<OnBoarding />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;

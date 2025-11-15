import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import App from "./routes/App";
import Play from "./routes/Play";
import Controller from "./routes/Controller";
import About from "./routes/About"
import './index.css'
import Header from "./components/Header";
import GameTest from "./routes/gameTest/gameTest";

const root = document.getElementById("root");

function AppWithConditionalHeader() {
  const { pathname } = useLocation();
  
  return (
    <>
      {pathname !== "/controller" && <Header />}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/play" element={<Play />} />
        <Route path="/controller" element={<Controller />} />
        <Route path="/about" element={<About />} />
        <Route path="/gametest" element={<GameTest />} />
      </Routes>
    </>
  );
}

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <AppWithConditionalHeader />
    </BrowserRouter>,
  );
} else {
  throw new Error('Root element not found');
}

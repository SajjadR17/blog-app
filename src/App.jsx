import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Essays from "./pages/Essays";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="main">
          <Routes>
            <Route element={<Navigate to={"/essays"} replace />} path="/" />
            <Route element={<></>} path="/essay/:slug" />
            <Route element={<Essays />} path="/essays" />
            <Route element={<Journal />} path="/journal" />
            <Route element={<About />} path="/about" />
            <Route element={<Login />} path="/login" />
          </Routes>
        </div>
        <div className="sidebar">
          <SideBar />
        </div>
      </main>
    </>
  );
}

export default App;

import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Essays from "./components/Essays";

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

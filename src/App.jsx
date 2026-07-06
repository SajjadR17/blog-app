import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

function App() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="main">
          <Routes>
            <Route element={<Navigate to={"/essays"} replace />} path="/" />
            <Route element={<></>} path="/:slug" />
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

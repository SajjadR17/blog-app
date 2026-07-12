import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Essays from "./pages/Essays";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Login from "./pages/Login";
import EssayDetailsPage from "./pages/EssayDetailsPage";
import AddBlog from "./pages/AddBlog";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Routes>
          <Route element={<Navigate to={"/essays"} replace />} path="/" />
          <Route element={<EssayDetailsPage />} path="/essay/:slug" />
          <Route element={<Essays />} path="/essays" />
          <Route element={<Journal />} path="/journal" />
          <Route element={<About />} path="/about" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<AddBlog />} path="/add-blog" />
        </Routes>
      </main>
    </>
  );
}

export default App;

import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Essays from "./pages/Essays";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Login from "./pages/Login";
import EssayDetailsPage from "./pages/EssayDetailsPage";
import AddBlog from "./pages/AddBlog";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";
import EssayEditPage from "./pages/EssayEditPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="container">
        <Routes>
          <Route element={<Navigate to={"/essays"} replace />} path="/" />
          <Route element={<EssayDetailsPage />} path="/essay/:slug" />
          <Route element={<EssayEditPage />} path="/essay/edit/:slug" />
          <Route element={<Essays />} path="/essays" />
          <Route element={<Journal />} path="/journal" />
          <Route element={<About />} path="/about" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
          <Route element={<AddBlog />} path="/add-blog" />
          <Route element={<Profile />} path="/profile" />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

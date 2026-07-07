import { MdMessage } from "react-icons/md";
import "../styles/sideBar.css";
import { BiCoffee, BiCopyright, BiHeart } from "react-icons/bi";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categories, setCategories] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEssays = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "posts"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories([...new Set(data.map((p) => p.category))]);
        setRecentPosts(data.slice(0, 3));
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEssays();
  }, []);

  return (
    <>
      <h1 className="sidebar-title display">Sidebar</h1>
      <div className="sidebar-about">
        <span className="mono about-title">ABOUT THE BLOG</span>
        <span className="body about-content">
          Short essays on paying closer attention to ordinary things, with the
          occasional technical note on software engineering.
          <span>
            2026 Blog, All Rights Reserved
            <BiCopyright />
          </span>
          <span>
            Developed by Sajjad Roohandeh with <BiHeart /> and <BiCoffee />
          </span>
        </span>
      </div>
      <div className="categories">
        <span className="mono categories-title">CATEGORIES</span>
        <span className="body categories-content">
          {error
            ? "Unable to fetch categories"
            : categories?.map((c) => (
                <div className="category">
                  <div className="category-circle"></div>
                  {c}
                </div>
              ))}
        </span>
      </div>
      <div className="recent-posts">
        <span className="mono recent-posts-title">RECENT POSTS</span>
        <span className="body recent-posts-content">
          {error
            ? "Unable to fetch recent posts"
            : recentPosts?.map((p) => (
                <div
                  className="recent-post"
                  onClick={() => navigate(`/${p.slug}`)}
                >
                  <div className="recent-post-circle"></div>
                  {p.title}
                </div>
              ))}
        </span>
      </div>
    </>
  );
}

export default SideBar;

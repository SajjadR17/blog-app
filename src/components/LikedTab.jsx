import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getLikedPosts } from "../utils/helpers";
import "../styles/likedTabs.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { BiSad } from "react-icons/bi";
import { arrayRemove, doc, increment, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";

function LikedTab() {
  const { user, userProfile } = useAuth();
  const [likedPosts, setLikedPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiked = async () => {
      if (!userProfile?.likes || userProfile.likes.length === 0) {
        setLikedPosts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const posts = await getLikedPosts(userProfile.likes);
      setLikedPosts(posts);
      setLoading(false);
    };
    fetchLiked();
  }, [userProfile]);

  const deleteLikedPostHandler = async (slug) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const postRef = doc(db, "posts", slug);

      const batch = writeBatch(db);

      batch.update(userRef, { likes: arrayRemove(slug) });
      batch.update(postRef, { likes: increment(-1) });

      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return (
      <div className="profile-likes-loading mono">
        <ClipLoader color="var(--accent)" size={25} /> LOADING LIKED
      </div>
    );
  if (likedPosts.length === 0)
    return (
      <p className="profile-empty-likes mono">
        <BiSad size={40} />
        NO LIKED POSTS YET
      </p>
    );

  return (
    <div className="profile-post-list">
      {likedPosts.map((post) => (
        <div className="profile-post-row" key={post.id}>
          <div
            className="profile-post-main"
            onClick={() => navigate(`/essay/${post.slug}`)}
          >
            <span className="profile-post-eyebrow mono">{post.category}</span>
            <div className="profile-post-title display">{post.title}</div>
            <span className="profile-post-meta mono">
              {post.date} · {post.readMins} min read
            </span>
          </div>
          <div className="post-action-btns">
            <button
              className="delete-profile-liked-post"
              onClick={() => deleteLikedPostHandler(post.slug)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LikedTab;

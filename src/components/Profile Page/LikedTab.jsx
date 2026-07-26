import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getLikedPosts } from "../../utils/helpers";
import "../../styles/profileTab.css";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { BiSad } from "react-icons/bi";
import { arrayRemove, doc, increment, writeBatch } from "firebase/firestore";
import { db } from "../../../firebase";

function LikedTab() {
  const { user, userProfile } = useAuth();
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile?.likes) return;
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

  const deleteLikedPostHandler = async (e, slug) => {
    e.stopPropagation();
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
        <ClipLoader color="var(--accent)" size={25} /> LOADING LIKES
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
        <div
          className="profile-post-row"
          onClick={() => navigate(`/essay/${post?.slug}`)}
          key={post?.id}
        >
          <div className="profile-post-main">
            <span className="profile-post-eyebrow mono">{post?.category}</span>
            <div className="profile-post-title display">{post?.title}</div>
            <span className="profile-post-meta mono">
              {post?.date} · {post?.readMins} min read
            </span>
          </div>
          <div className="post-action-btns">
            <button
              className="delete-profile-liked-post"
              onClick={(e) => deleteLikedPostHandler(e, post?.slug)}
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

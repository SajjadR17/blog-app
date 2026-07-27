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
    const fetchLiked = async () => {
      if (!userProfile?.likes?.length) {
        setLikedPosts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const posts = await getLikedPosts(userProfile.likes);

        setLikedPosts(posts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, [userProfile]);

  const deleteLikedPostHandler = async (e, postId) => {
    e.stopPropagation();

    try {
      const userRef = doc(db, "users", user.uid);
      const postRef = doc(db, "posts", postId);

      const batch = writeBatch(db);

      batch.update(userRef, {
        likes: arrayRemove(postId),
      });

      batch.update(postRef, {
        likes: increment(-1),
      });

      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="profile-likes-loading mono">
        <ClipLoader color="var(--accent)" size={25} />
        LOADING LIKES
      </div>
    );
  }

  if (likedPosts.length === 0) {
    return (
      <p className="profile-empty-likes mono">
        <BiSad size={40} />
        NO LIKED POSTS YET
      </p>
    );
  }

  return (
    <div className="profile-post-list">
      {likedPosts.map((post) => (
        <div
          className="profile-post-row"
          key={post.id}
          onClick={() => navigate(`/essay/${post.slug}`)}
        >
          <div className="profile-post-main">
            <span className="profile-post-eyebrow mono">{post.category}</span>

            <div className="profile-post-title display">{post.title}</div>

            <span className="profile-post-meta mono">
              {post.date} · {post.readMins} min read
            </span>
          </div>

          <div className="post-action-btns">
            <button
              className="delete-profile-liked-post"
              onClick={(e) => deleteLikedPostHandler(e, post.id)}
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

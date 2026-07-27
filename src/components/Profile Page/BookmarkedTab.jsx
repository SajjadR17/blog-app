import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getBookmarkedPosts } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { BiSad } from "react-icons/bi";
import { arrayRemove, doc, increment, writeBatch } from "firebase/firestore";
import { db } from "../../../firebase";

function BookmarkedTab() {
  const { user, userProfile } = useAuth();
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarked = async () => {
      if (!userProfile?.bookmarks?.length) {
        setBookmarkedPosts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const posts = await getBookmarkedPosts(userProfile.bookmarks);

        setBookmarkedPosts(posts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarked();
  }, [userProfile]);

  const deleteBookmarkedPostHandler = async (e, postId) => {
    e.stopPropagation();

    try {
      const userRef = doc(db, "users", user.uid);
      const postRef = doc(db, "posts", postId);

      const batch = writeBatch(db);

      batch.update(userRef, {
        bookmarks: arrayRemove(postId),
      });

      batch.update(postRef, {
        bookmarks: increment(-1),
      });

      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="profile-bookmarks-loading mono">
        <ClipLoader color="var(--accent)" size={25} />
        LOADING BOOKMARKS
      </div>
    );
  }

  if (bookmarkedPosts.length === 0) {
    return (
      <p className="profile-empty-bookmarks mono">
        <BiSad size={40} />
        NO BOOKMARKED POSTS YET
      </p>
    );
  }

  return (
    <div className="profile-post-list">
      {bookmarkedPosts.map((post) => (
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
              className="delete-profile-bookmarked-post"
              onClick={(e) => deleteBookmarkedPostHandler(e, post.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookmarkedTab;

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getBookmarkedPosts } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { BiSad } from "react-icons/bi";
import { arrayRemove, doc, increment, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";

function BookmarkedTab() {
  const { user, userProfile } = useAuth();
  const [bookmarkedPosts, setBookmarkedPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarked = async () => {
      if (!userProfile?.bookmarks || userProfile.bookmarks.length === 0) {
        setBookmarkedPosts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const posts = await getBookmarkedPosts(userProfile.bookmarks);
      setBookmarkedPosts(posts);
      setLoading(false);
    };
    fetchBookmarked();
  }, [userProfile]);

  const deleteBookmarkedPostHandler = async (e,slug) => {
    e.stopPropagation();
    try {
      const userRef = doc(db, "users", user.uid);
      const postRef = doc(db, "posts", slug);

      const batch = writeBatch(db);

      batch.update(userRef, { bookmarks: arrayRemove(slug) });
      batch.update(postRef, { bookmarks: increment(-1) });

      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return (
      <div className="profile-bookmarks-loading mono">
        <ClipLoader color="var(--accent)" size={25} /> LOADING BOOKMARKED
      </div>
    );
  if (bookmarkedPosts.length === 0)
    return (
      <p className="profile-empty-bookmarks mono">
        <BiSad size={40} />
        NO BOOKMARKED POSTS YET
      </p>
    );

  return (
    <div className="profile-post-list">
      {bookmarkedPosts.map((post) => (
        <div className="profile-post-row" onClick={() => navigate(`/essay/${post.slug}`)} key={post.id}>
          <div
            className="profile-post-main"
          >
            <span className="profile-post-eyebrow mono">{post.category}</span>
            <div className="profile-post-title display">{post.title}</div>
            <span className="profile-post-meta mono">
              {post.date} · {post.readMins} min read
            </span>
          </div>
          <div className="post-action-btns">
            <button
              className="delete-profile-bookmarked-post"
              onClick={(e) => deleteBookmarkedPostHandler(e,post.slug)}
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

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserPublishedPosts } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { BiSad } from "react-icons/bi";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { GrEdit } from "react-icons/gr";

function PostsTab() {
  const { userProfile } = useAuth();
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userProfile?.uid) return;

      try {
        setLoading(true);

        const posts = await getUserPublishedPosts(userProfile.uid);

        setPublishedPosts(posts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userProfile?.uid]);

  const deletePublishedPostHandler = async (e, postId) => {
    e.stopPropagation();
    try {
      setDeleting(true);

      await deleteDoc(doc(db, "posts", postId));

      setPublishedPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
    }
  };

  const editPublishedPostHandler = (e, slug) => {
    e.stopPropagation();

    navigate(`/essay/edit/${slug}`);
  };

  if (loading) {
    return (
      <div className="profile-published-posts-loading mono">
        <ClipLoader color="var(--accent)" size={25} />
        LOADING POSTS
      </div>
    );
  }

  if (publishedPosts.length === 0) {
    return (
      <p className="profile-empty-published-posts mono">
        <BiSad size={40} />
        NO PUBLISHED POSTS YET
      </p>
    );
  }

  return (
    <div className="profile-post-list">
      {publishedPosts.map((post) => (
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
          <div
            className="post-action-btns"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="delete-profile-published-post"
              disabled={deleting}
              onClick={(e) => deletePublishedPostHandler(e, post.id)}
            >
              ✕
            </button>
            <button
              className="edit-profile-published-post"
              disabled={deleting}
              onClick={(e) => editPublishedPostHandler(e, post.slug)}
            >
              <GrEdit />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostsTab;

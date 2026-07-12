import { useNavigate, useParams } from "react-router-dom";
import "../styles/essayDetailsPage.css";
import { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { BiArrowToLeft, BiHeart, BiSolidHeart } from "react-icons/bi";
import { BsArrowLeft, BsClock, BsWifiOff } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

function EssayDetailsPage() {
  const { slug } = useParams();
  const [essayDetails, setEssayDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const isLiked = userProfile?.liked?.includes(essayDetails?.slug) || false;

  useEffect(() => {
    const docRef = doc(db, "posts", slug);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setEssayDetails({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } else {
        setError(true);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [slug]);

  async function toggleLike() {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const postRef = doc(db, "posts", essayDetails.slug);

    const batch = writeBatch(db);

    if (isLiked) {
      batch.update(userRef, { liked: arrayRemove(essayDetails.slug) });
      batch.update(postRef, { likes: increment(-1) });
    } else {
      batch.update(userRef, { liked: arrayUnion(essayDetails.slug) });
      batch.update(postRef, { likes: increment(1) });
    }

    await batch.commit();
  }

  if (loading) {
    return (
      <div className="essays-loading">
        <ClipLoader color="var(--text-secondary)" size={25} />
        <span style={{ color: "var(--text-secondary)" }} className="mono">
          LOADING ESSAY
        </span>
      </div>
    );
  }

  if (error || !essayDetails) {
    return (
      <div className="essays-error">
        {navigator.onLine ? (
          <MdErrorOutline size={40} color="var(--text-secondary)" />
        ) : (
          <BsWifiOff size={40} color="var(--text-secondary)" />
        )}
        <span style={{ color: "var(--text-secondary)" }} className="mono">
          {navigator.onLine
            ? "SOMETHING WENT WRONG."
            : "CHECK YOUR INTERNET CONNECTION"}
        </span>
      </div>
    );
  }

  return (
    <div className="essay">
      <div onClick={() => navigate("/essays")} className="back-btn mono">
        <BsArrowLeft /> BACK TO ESSAYS
      </div>
      <span className="essay-category mono">{essayDetails.category}</span>
      <h1 className="essay-title display">{essayDetails.title}</h1>
      <div className="writer-profile-card body">
        <div className="writer-profile-img mono">
          {essayDetails.authorInitials}
        </div>
        <div className="writer-profile-info">
          <span className="writer-name">{essayDetails.author}</span>
          <div className="essay-micro-details mono">
            <span className="essay-createdAt">{essayDetails.date}</span>
            <span className="essay-read-mins">
              <BsClock size={10} />
              {essayDetails.readMins} mins read
            </span>
          </div>
        </div>
      </div>
      <span className="essay-body body">{essayDetails.body}</span>
      <div className="essay-bottom">
        <div className="essay-tags mono">
          {essayDetails.tags.map((tag, i) => (
            <div className="tag" key={i}>
              {tag.toUpperCase()}
            </div>
          ))}
        </div>
        <button className="like-btn" onClick={toggleLike}>
          {isLiked ? <BiSolidHeart size={15} /> : <BiHeart size={15} />}
          <span className="mono like-count">{essayDetails.likes}</span>
        </button>
      </div>
    </div>
  );
}

export default EssayDetailsPage;

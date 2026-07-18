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
import {
  BiArrowToLeft,
  BiBookmark,
  BiHeart,
  BiSolidBookmark,
  BiSolidHeart,
} from "react-icons/bi";
import { BsArrowLeft, BsClock, BsWifiOff } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import { LuBadgeCheck } from "react-icons/lu";

function EssayDetailsPage() {
  const { slug } = useParams();
  const [essayDetails, setEssayDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const isLiked = userProfile?.likes?.includes(essayDetails?.slug) || false;
  const isBookmarked =
    userProfile?.bookmarks?.includes(essayDetails?.slug) || false;

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

  const toggleLike = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const postRef = doc(db, "posts", essayDetails.slug);

    const batch = writeBatch(db);

    if (isLiked) {
      batch.update(userRef, { likes: arrayRemove(essayDetails.slug) });
      batch.update(postRef, { likes: increment(-1) });
    } else {
      batch.update(userRef, { likes: arrayUnion(essayDetails.slug) });
      batch.update(postRef, { likes: increment(1) });
    }

    await batch.commit();
  };

  const toggleBookmark = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const postRef = doc(db, "posts", essayDetails.slug);

    const batch = writeBatch(db);

    if (isBookmarked) {
      batch.update(userRef, { bookmarks: arrayRemove(essayDetails.slug) });
      batch.update(postRef, { bookmarks: increment(-1) });
    } else {
      batch.update(userRef, { bookmarks: arrayUnion(essayDetails.slug) });
      batch.update(postRef, { bookmarks: increment(1) });
    }

    await batch.commit();
  };

  const followHandler = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!essayDetails || !user) {
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const authorRef = doc(db, "users", essayDetails.authorUid);

      const batch = writeBatch(db);

      if (userProfile?.followings?.includes(essayDetails?.authorUid)) {
        batch.update(userRef, {
          followings: arrayRemove(essayDetails.authorUid),
        });
        batch.update(authorRef, { followers: arrayRemove(user.uid) });
      } else {
        batch.update(userRef, {
          followings: arrayUnion(essayDetails.authorUid),
        });
        batch.update(authorRef, { followers: arrayUnion(user.uid) });
      }

      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  };

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
      <span className="essay-category mono">{essayDetails?.category}</span>
      <h1 className="essay-title display">{essayDetails?.title}</h1>
      <div className="author-profile-card-container">
        <div className="author-profile-card body">
          <div className="author-profile-img mono">
            {essayDetails?.authorInitials}
          </div>
          <div className="author-profile-info">
            <span className="author-name">{essayDetails?.author}</span>
            <div className="essay-micro-details mono">
              <span className="essay-created-at">{essayDetails?.date}</span>
            </div>
          </div>
        </div>
        {userProfile?.uid !== essayDetails?.authorUid && (
          <button onClick={followHandler} className="follow-author-btn">
            {userProfile?.followings?.includes(essayDetails?.authorUid)
              ? "Following"
              : "+ Follow"}
          </button>
        )}
      </div>
      <p className="essay-body body">{essayDetails?.body}</p>
      <div className="essay-bottom">
        <div className="essay-tags mono">
          {essayDetails.tags.map((tag, i) => (
            <div className="tag" key={i}>
              {tag.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
      <div className="essay-intractions">
        <span>Enjoyed this piece?</span>
        <div className="essay-btns">
          <button className="like-btn" onClick={toggleLike}>
            {isLiked ? <BiSolidHeart size={15} /> : <BiHeart size={15} />}
            <span className="mono like-count">{essayDetails?.likes}</span>
          </button>
          <button className="bookmark-btn" onClick={toggleBookmark}>
            {isBookmarked ? (
              <BiSolidBookmark size={15} />
            ) : (
              <BiBookmark size={15} />
            )}
            <span className="mono bookmark-count">
              {essayDetails?.bookmarks}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EssayDetailsPage;

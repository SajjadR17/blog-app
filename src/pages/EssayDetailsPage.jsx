import { useNavigate, useParams } from "react-router-dom";
import "../styles/essayDetailsPage.css";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { BiArrowToLeft } from "react-icons/bi";
import { BsArrowLeft, BsClock, BsWifiOff } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
import { MdErrorOutline } from "react-icons/md";

function EssayDetailsPage() {
  const { slug } = useParams();
  const [essayDetails, setEssayDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEssay = async () => {
      try {
        const docRef = doc(db, "posts", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEssayDetails({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
        setEssayDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEssay();
  }, [slug]);

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
            ? "SOMETHING WENT WRONG.CHECK YOUR INTERNET OR TRY AGAIN LATER"
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
      <div className="essay-tags mono">
        {essayDetails.tags.map((tag) => (
          <div className="tag">{tag.toUpperCase()}</div>
        ))}
      </div>
    </div>
  );
}

export default EssayDetailsPage;

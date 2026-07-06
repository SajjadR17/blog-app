import { useEffect, useState } from "react";
import "../styles/essays.css";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { BsClock, BsWifiOff } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { MdErrorOutline } from "react-icons/md";

function Essays() {
  const [essays, setEssays] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
        setEssays(data);
        console.log(db.app.options.projectId);
        console.log(data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEssays();
  }, []);

  if (loading) {
    return (
      <div className="essays-loading">
        <ClipLoader color="var(--text-secondary)" size={25} />
        <span style={{ color: "var(--text-secondary)" }} className="mono">
          LOADING ESSAYS
        </span>
      </div>
    );
  }

  if (error || (essays && essays.length === 0)) {
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
    <div className="essays">
      {essays.map((essay) => (
        <div
          className="essay"
          onClick={() => navigate(`/assay/${essay.slug}`)}
          key={essay.id}
        >
          <span className="essay-eyebrow mono">
            {essay.category.toUpperCase()}
          </span>
          <h1 className="essay-title display">{essay.title}</h1>
          <span className="essay-excerpt body">{essay.excerpt}</span>
          <div className="essay-details mono">
            <span className="essay-createdAt">{essay.date}</span>
            <span className="essay-read-mins">
              <BsClock size={13} />
              {essay.readMins} Min read
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Essays;

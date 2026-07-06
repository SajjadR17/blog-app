import { useEffect, useState } from "react";
import "../styles/journal.css";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { MdErrorOutline } from "react-icons/md";
import { BsWifiOff } from "react-icons/bs";

function Journal() {
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchJournal = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "journal"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJournal(data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, []);

  if (loading) {
    return (
      <div className="journal-loading">
        <ClipLoader color="var(--text-secondary)" size={25} />
        <span style={{ color: "var(--text-secondary)" }} className="mono">
          LOADING JOURNAL
        </span>
      </div>
    );
  }

  if (error || (journal && journal.length === 0)) {
    return (
      <div className="journal-error">
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
    <>
      <h1 className="journal-title display">Journal</h1>
      <div className="journal">
        {journal.map((item) => (
          <div className="journal" key={item.id}>
            <span className="journal-eyebrow mono">
              {item.mood.toUpperCase()}
            </span>
            <span className="journal-content body">{item.content}</span>
            <span className="journal-createdAt mono">{item.date}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Journal;

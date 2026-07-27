import { useEffect, useMemo, useState } from "react";
import "../styles/essayEditPage.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../contexts/AuthContext";
import { ClipLoader } from "react-spinners";

function EssayEditPage() {
  const { slug } = useParams();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [essayDetails, setEssayDetails] = useState(null);
  const [error, setError] = useState("");

  const [titleValue, setTitleValue] = useState("");
  const [slugValue, setSlugValue] = useState("");
  const [excerptValue, setExcerptValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [tagsValue, setTagsValue] = useState("");
  const [parsedTags, setParsedTags] = useState([]);
  const [readMinsValue, setReadMinsValue] = useState("");

  useEffect(() => {
    if (!user || userProfile?.role !== "admin") {
      navigate("/essays");
    }
  }, [user, userProfile, navigate]);

  useEffect(() => {
    let cancelled = false;

    const fetchEssay = async () => {
      setLoading(true);
      setError("");

      try {
        const q = query(collection(db, "posts"), where("slug", "==", slug));

        const snapshot = await getDocs(q);

        if (cancelled) return;

        if (snapshot.empty) {
          navigate("/404");
          return;
        }

        const docSnap = snapshot.docs[0];

        setEssayDetails({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Failed to load post.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchEssay();
    }

    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);


  useEffect(() => {
    if (!essayDetails) return;

    setTitleValue(essayDetails.title || "");
    setSlugValue(essayDetails.slug || "");
    setExcerptValue(essayDetails.excerpt || "");
    setTextValue(essayDetails.body || "");
    setCategoryValue(essayDetails.category || "");

    const tags = essayDetails.tags || [];

    setTagsValue(tags.join(", "));
    setParsedTags(tags);

    setReadMinsValue(String(essayDetails.readMins || ""));
  }, [essayDetails]);


  useEffect(() => {
    const tags = [
      ...new Set(
        tagsValue
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];

    setParsedTags(tags);
  }, [tagsValue]);

  const isSameArray = (a, b) => {
    if (a.length !== b.length) return false;

    return [...a].sort().join(",") === [...b].sort().join(",");
  };

  const disableBtn = useMemo(() => {
    if (!essayDetails) return true;

    return (
      titleValue.trim() === essayDetails.title &&
      slugValue.trim() === essayDetails.slug &&
      excerptValue.trim() === essayDetails.excerpt &&
      textValue.trim() === essayDetails.body &&
      categoryValue.trim() === essayDetails.category &&
      Number(readMinsValue) === Number(essayDetails.readMins) &&
      isSameArray(parsedTags, essayDetails.tags || [])
    );
  }, [
    essayDetails,
    titleValue,
    slugValue,
    excerptValue,
    textValue,
    categoryValue,
    readMinsValue,
    parsedTags,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (disableBtn || saving) return;

    const trimmedTitle = titleValue.trim();
    const trimmedSlug = slugValue.trim();
    const trimmedExcerpt = excerptValue.trim();
    const trimmedText = textValue.trim();
    const trimmedCategory = categoryValue.trim();

    const mins = Number(readMinsValue);

    if (
      !trimmedTitle ||
      !trimmedExcerpt ||
      !trimmedText ||
      !trimmedCategory ||
      !readMinsValue.trim() ||
      parsedTags.length === 0
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!Number.isInteger(mins) || mins <= 0) {
      setError("Read minutes must be a positive number.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (slug !== trimmedSlug) {
        const slugQuery = query(
          collection(db, "posts"),
          where("slug", "==", trimmedSlug),
        );

        const slugSnapshot = await getDocs(slugQuery);

        const duplicatePost = slugSnapshot.docs.find(
          (item) => item.id !== essayDetails.id,
        );

        if (duplicatePost) {
          setError("A post with this slug already exists.");
          return;
        }
      }

      await updateDoc(doc(db, "posts", essayDetails.id), {
        title: trimmedTitle,
        slug: trimmedSlug,
        excerpt: trimmedExcerpt,
        body: trimmedText,
        category: trimmedCategory,
        tags: parsedTags,
        readMins: mins,
      });

      navigate(`/essay/${trimmedSlug}`, {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="essays-loading">
        <ClipLoader size={25} />
      </div>
    );
  }

  return (
    <>
      <h1 className="edit-blog-title display">Edit Post</h1>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={submitHandler} className="edit-blog-form">
        <div className="edit-blog-input-container">
          <span className="mono">
            Title <span className="required-star">*</span>
          </span>

          <input
            spellCheck="false"
            type="text"
            placeholder="Enter the post title"
            onChange={(e) => {
              const value = e.target.value;

              setTitleValue(value);

              setSlugValue(
                value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, ""),
              );
            }}
            value={titleValue}
          />
        </div>

        <div className="edit-blog-input-container">
          <span className="mono">Slug</span>

          <input
            spellCheck="false"
            type="text"
            value={slugValue}
            placeholder="auto-generated-from-title"
            disabled
          />
        </div>

        <div className="edit-blog-input-container">
          <span className="mono">
            Excerpt <span className="required-star">*</span>
          </span>

          <textarea
            spellCheck="false"
            placeholder="A short 1-2 sentence summary shown in the post list"
            onChange={(e) => setExcerptValue(e.target.value)}
            value={excerptValue}
          />
        </div>

        <div className="edit-blog-input-container">
          <span className="mono">
            Text <span className="required-star">*</span>
          </span>

          <textarea
            spellCheck="false"
            placeholder="Write the full post content here"
            onChange={(e) => setTextValue(e.target.value)}
            value={textValue}
          />
        </div>

        <div className="edit-blog-input-container">
          <span className="mono">
            Category <span className="required-star">*</span>
          </span>

          <input
            spellCheck="false"
            type="text"
            placeholder="e.g. Frontend, Backend, Attention"
            onChange={(e) => setCategoryValue(e.target.value)}
            value={categoryValue}
          />
        </div>

        <div className="edit-blog-input-container">
          <span className="mono">
            ReadMins <span className="required-star">*</span>
          </span>

          <input
            spellCheck="false"
            type="number"
            min="1"
            placeholder="e.g. 5"
            onChange={(e) => setReadMinsValue(e.target.value)}
            value={readMinsValue}
          />
        </div>
        <div className="edit-blog-input-container">
          <span className="mono">
            Tags <span className="required-star">*</span>
          </span>

          <input
            spellCheck="false"
            type="text"
            placeholder="Comma-separated, e.g. react, web, frontend"
            onChange={(e) => setTagsValue(e.target.value)}
            value={tagsValue}
          />

          <div className="parsed-tags">
            {parsedTags.map((tag) => (
              <div className="parsed-tag" key={tag}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        <button
          className="publish-post-btn"
          disabled={disableBtn || saving}
          type="submit"
        >
          {saving ? <ClipLoader size={20} color="#fff" /> : "Update"}
        </button>
      </form>
    </>
  );
}

export default EssayEditPage;

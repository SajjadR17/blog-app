import { useEffect, useState } from "react";
import "../styles/addBlog.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ClipLoader } from "react-spinners";

function loadDraft() {
  try {
    const saved = localStorage.getItem("addBlogDraft");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const savedDraft = loadDraft();

function AddBlog() {
  const [excerptValue, setExcerptValue] = useState(
    savedDraft?.excerptValue || "",
  );
  const [textValue, setTextValue] = useState(savedDraft?.textValue || "");
  const [titleValue, setTitleValue] = useState(savedDraft?.titleValue || "");
  const [slugValue, setSlugValue] = useState(savedDraft?.slugValue || "");
  const [categoryValue, setCategoryValue] = useState(
    savedDraft?.categoryValue || "",
  );
  const [readMinsValue, setReadMinsValue] = useState(
    savedDraft?.readMinsValue || "",
  );
  const [tagsValue, setTagsValue] = useState(savedDraft?.tagsValue || "");
  const [parsedTags, setParsedTags] = useState(() =>
    savedDraft?.tagsValue
      ? savedDraft.tagsValue
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const date = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/essays");
    }
  }, [navigate, user]);

  useEffect(() => {
    const draft = {
      excerptValue,
      textValue,
      titleValue,
      slugValue,
      categoryValue,
      readMinsValue,
      tagsValue,
    };

    const isEmpty = Object.values(draft).every((v) => v.length === 0);
    if (isEmpty) {
      localStorage.removeItem("addBlogDraft");
    } else {
      localStorage.setItem("addBlogDraft", JSON.stringify(draft));
    }
  }, [
    excerptValue,
    textValue,
    titleValue,
    slugValue,
    categoryValue,
    readMinsValue,
    tagsValue,
  ]);

  useEffect(() => {
    if (error) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [error]);

  function parseTags(input) {
    setParsedTags(
      input
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    );
  }

  function clearDraft() {
    localStorage.removeItem("addBlogDraft");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    if (
      excerptValue.length === 0 ||
      textValue.length === 0 ||
      titleValue.length === 0 ||
      categoryValue.length === 0 ||
      readMinsValue.length === 0 ||
      tagsValue.length === 0
    ) {
      setError("Please fill in all fields.");
      setSaving(false);
      return;
    }

    const existingDoc = await getDoc(doc(db, "posts", slugValue));
    if (existingDoc.exists()) {
      setError(
        "A post with this slug already exists. Please choose a different title.",
      );
      setSaving(false);
      return;
    }

    try {
      await setDoc(doc(db, "posts", slugValue), {
        title: titleValue,
        slug: slugValue,
        excerpt: excerptValue,
        body: textValue,
        author: "Sajjad Roohandeh",
        authorInitials: "SR",
        category: categoryValue,
        tags: parsedTags,
        readMins: Number(readMinsValue),
        date: date,
        id: crypto.randomUUID(),
      });

      clearDraft();
      navigate("/essays");
    } catch (err) {
      console.log(err);
      setError("Something went wrong, please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {error && (
        <div className="error-modal">
          <span className="error-text">{error}</span>
          <button className="error-modal-ok-btn" onClick={() => setError("")}>
            Ok
          </button>
        </div>
      )}
      <div className={`overlay ${error.length > 0 ? "active" : null}`}></div>
      <div className="add-blog">
        <h1 className="add-blog-title display">Add Post</h1>
        <form onSubmit={handleSubmit} className="add-blog-form">
          <div className="add-blog-input-container">
            <span className="mono">Author</span>
            <input type="text" value={"Sajjad Roohandeh"} disabled />
          </div>
          <div className="add-blog-input-container">
            <span className="mono">
              Title <span className="required-star">*</span>
            </span>
            <input
              spellCheck="false"
              type="text"
              placeholder="Enter the post title"
              onChange={(e) => {
                setTitleValue(e.target.value);
                setSlugValue(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, ""),
                );
              }}
              value={titleValue}
            />
            <span className="mono input-err"></span>
          </div>
          <div className="add-blog-input-container">
            <span className="mono">Slug</span>
            <input
              spellCheck="false"
              type="text"
              value={slugValue}
              placeholder="auto-generated-from-title"
              disabled
            />
            <span className="mono input-err"></span>
          </div>
          <div className="add-blog-input-container">
            <span className="mono">
              Excerpt <span className="required-star">*</span>
            </span>
            <textarea
              spellCheck="false"
              type="text"
              placeholder="A short 1-2 sentence summary shown in the post list"
              onChange={(e) => setExcerptValue(e.target.value)}
              value={excerptValue}
            />
            <span className="mono input-err"></span>
          </div>
          <div className="add-blog-input-container">
            <span className="mono">
              Text <span className="required-star">*</span>
            </span>
            <textarea
              spellCheck="false"
              type="text"
              placeholder="Write the full post content here"
              onChange={(e) => setTextValue(e.target.value)}
              value={textValue}
            />
            <span className="mono input-err"></span>
          </div>
          <div className="add-blog-input-container">
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
            <span className="mono input-err"></span>
          </div>
          <div className="add-blog-input-container">
            <span className="mono">
              ReadMins <span className="required-star">*</span>
            </span>
            <input
              spellCheck="false"
              type="text"
              placeholder="e.g. 5"
              onChange={(e) => setReadMinsValue(e.target.value)}
              value={readMinsValue}
            />
            <span className="mono input-err"></span>
          </div>
          <div className="add-blog-input-container">
            <span className="mono">
              Tags <span className="required-star">*</span>
            </span>
            <input
              spellCheck="false"
              type="text"
              placeholder="Comma-separated, e.g. react, web, frontend"
              onChange={(e) => {
                setTagsValue(e.target.value);
                parseTags(e.target.value);
              }}
              value={tagsValue}
            />
            <div className="parsed-tags">
              {parsedTags.map((tag, i) => (
                <div className="parsed-tag" key={i}>
                  {tag}
                </div>
              ))}
            </div>
            <span className="mono input-err"></span>
          </div>
          <button className="publish-post-btn" type="submit">
            {saving ? <ClipLoader size={20} color="#fff" /> : "Publish"}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddBlog;

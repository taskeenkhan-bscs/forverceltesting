import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Compoment/Sidebar.jsx"

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial; }

  .ap-page {
    display: flex;
    min-height: 100vh;
    background: #f3f4f6;
  }

  .ap-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    overflow-y: auto;
  }

  .form-box {
    width: 100%;
    max-width: 500px;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }

  .form-box h2 {
    text-align: center;
    margin-bottom: 24px;
    color: #111827;
    font-size: 22px;
    font-weight: 700;
  }

  .form-box input,
  .form-box textarea,
  .form-box select {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    outline: none;
    font-size: 14px;
    color: #111827;
    transition: border-color 0.2s;
  }

  .form-box input:focus,
  .form-box textarea:focus,
  .form-box select:focus {
    border-color: #6366f1;
  }

  .form-box textarea {
    height: 100px;
    resize: none;
  }

  .form-box label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-box button {
    width: 100%;
    padding: 13px;
    background: #111827;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 6px;
    transition: background 0.2s;
  }

  .form-box button:hover { background: #374151; }
  .form-box button:disabled { background: #9ca3af; cursor: not-allowed; }

  .success-msg {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
    text-align: center;
  }

  .error-msg {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
    text-align: center;
  }

  @media (max-width: 768px) {
    .ap-page { flex-direction: column; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

export default function AddProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    status: "",
    deadline: "",
    picture: null,
    member: "",
  });

  const [members,  setMembers]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [successMsg, setSuccess] = useState("");
  const [errorMsg,   setError]   = useState("");

  useEffect(() => {
   axios.get(`${import.meta.env.VITE_BACKEND_URL}/getmember`)
      .then((res) => {
        if (res.data.success) {
          setMembers(res.data.data || res.data.members || []);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit() {
    if (!formData.title || !formData.category || !formData.priority || !formData.status) {
      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });

   const res = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/createform`,
  data,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  }
);

      console.log(res.data);
      setSuccess("Project added successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "",
        status: "",
        deadline: "",
        picture: null,
        member: "",
      });
    } catch (error) {
      console.error(error);
      setError("Failed to add project. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="ap-page">
        <Sidebar />

        <div className="ap-content">
          <div className="form-box">
            <h2>Add Project</h2>

            {successMsg && <div className="success-msg">✓ {successMsg}</div>}
            {errorMsg   && <div className="error-msg">⚠ {errorMsg}</div>}

            <label>Title *</label>
            <input
              type="text"
              name="title"
              placeholder="Project title"
              value={formData.title}
              onChange={handleChange}
            />

            <label>Description</label>
            <textarea
              name="description"
              placeholder="Project description"
              value={formData.description}
              onChange={handleChange}
            />

            <div className="form-row">
              <div>
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  <option value="App">App</option>
                  <option value="Web">Web</option>
                  <option value="Game">Game</option>
                </select>
              </div>

              <div>
                <label>Priority *</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="">Select priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Status *</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label>Assign Member</label>
            <select name="member" value={formData.member} onChange={handleChange}>
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.fullName}</option>
              ))}
            </select>

            <label>Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData((prev) => ({ ...prev, picture: e.target.files[0] }))}
            />

            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding…" : "Add Project"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
import axios from "axios";
import { useState } from "react";
import Sidebar from "../Compoment/Sidebar.jsx";

function CreateMember() {
  const [member, setMember] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    role: "",
    profilePicture: "",
  });

  const handleChange = (e) => {
    setMember({
      ...member,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("fullName", member.fullName);
      formData.append("email", member.email);
      formData.append("phoneNo", member.phoneNo);
      formData.append("role", member.role);
      formData.append("profilePicture", member.profilePicture);

    const res = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL}/createmember`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      alert("Member Created Successfully");
      console.log(res.data);

      setMember({
        fullName: "",
        email: "",
        phoneNo: "",
        role: "",
        profilePicture: "",
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="card">
          <h1>Create Member</h1>

          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={member.fullName}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={member.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phoneNo"
              placeholder="Phone Number"
              value={member.phoneNo}
              onChange={handleChange}
            />

            <select name="role" value={member.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Tester">Tester</option>
            </select>

            <input
              type="file"
              onChange={(e) =>
                setMember({
                  ...member,
                  profilePicture: e.target.files[0],
                })
              }
            />

            <button type="submit">Create Member</button>
          </form>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .layout {
          display: flex;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          width: 250px;
          background: #1f2937;
          color: white;
          min-height: 100vh;
        }

        .main {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f3f4f6;
          padding: 20px;
        }

        .card {
          width: 400px;
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .card h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form input,
        .form select {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }

        .form button {
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .form button:hover { 
          background: #1d4ed8; 
        }
      `}</style>
    </div>
  );
}

export default CreateMember;
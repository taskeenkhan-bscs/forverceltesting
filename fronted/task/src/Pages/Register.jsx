import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    address: "",
    cnic: "",
    age: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

 try {
  console.log(import.meta.env.VITE_BACKEND_URL);

  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/register`,
    form,
    {
      withCredentials: true,
    }
  );
 

      if (res.data.success) {
        alert("User Registered Successfully");
        navigate("/projectlist");
      }

      setForm({
        name: "",
        email: "",
        password: "",
        role: "employee",
        address: "",
        cnic: "",
        age: ""
      });
    } catch (error) {
      console.log(error);
      alert("Error Registering User");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="cnic" placeholder="CNIC" value={form.cnic} onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="login-text">Already have an account?</p>

        <button
          type="button"
          className="login-btn"
          onClick={() => navigate("/login")}
        >
          Login Here
        </button>
      </form>

      <style>{`
        .container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #eef2f3, #dfe9f3);
          padding: 20px;
        }

        .form-box {
          width: 100%;
          max-width: 380px;
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-box h2 {
          text-align: center;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .form-box input,
        .form-box select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
          transition: 0.2s;
        }

        .form-box input:focus,
        .form-box select:focus {
          border-color: #4f46e5;
        }

        .form-box button {
          padding: 10px;
          background: #111;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }

        .form-box button:hover {
          background: #333;
        }

        .form-box button:disabled {
          background: #999;
          cursor: not-allowed;
        }

        .login-text {
          text-align: center;
          font-size: 13px;
          margin-top: 10px;
          color: #555;
        }

        .login-btn {
          background: transparent !important;
          color: #2563eb !important;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }

        .login-btn:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .form-box {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;
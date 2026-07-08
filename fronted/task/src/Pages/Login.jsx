import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "employee",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const roleRoutes = {
    admin: "/",
    employee: "/createmember",
    manager: "/Membershowpage",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        form,
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        return alert(res.data.message);
      }

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      const role = res.data.user.role;

      alert("Login Successful ✅");

      navigate(roleRoutes[role] || "/");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Login Failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-card"
        onSubmit={handleSubmit}
      >
        <h2>Welcome Back</h2>

        <p className="subtitle">
          Login to continue managing your tasks
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <div className="divider"></div>

        <p className="register-text">
          Don't have an account?
        </p>

        <button
          type="button"
          className="register-btn"
          onClick={() => navigate("/reg")}
        >
          Create New Account
        </button>
      </form>
      <style>{`
        *{
          box-sizing:border-box;
          margin:0;
          padding:0;
          font-family:Segoe UI,sans-serif;
        }

        .login-container{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          background:linear-gradient(
            135deg,
            #0f172a,
            #1e293b,
            #334155
          );
          padding:20px;
        }

        .login-card{
          width:100%;
          max-width:420px;
          background:white;
          padding:35px;
          border-radius:20px;
          box-shadow:
          0 20px 40px rgba(0,0,0,.2);
          display:flex;
          flex-direction:column;
          gap:15px;
        }

        .login-card h2{
          text-align:center;
          color:#111827;
          font-size:30px;
        }

        .subtitle{
          text-align:center;
          color:#6b7280;
          margin-bottom:10px;
        }

        .login-card input,
        .login-card select{
          padding:14px;
          border:1px solid #d1d5db;
          border-radius:10px;
          outline:none;
          transition:.3s;
        }

        .login-card input:focus,
        .login-card select:focus{
          border-color:#2563eb;
          box-shadow:
          0 0 0 4px rgba(37,99,235,.15);
        }

        .login-card button{
          padding:14px;
          border:none;
          border-radius:10px;
          cursor:pointer;
          font-size:15px;
          font-weight:600;
          transition:.3s;
        }

        .login-card button[type="submit"]{
          background:#2563eb;
          color:white;
        }

        .login-card button[type="submit"]:hover{
          background:#1d4ed8;
        }

        .login-card button:disabled{
          opacity:.6;
          cursor:not-allowed;
        }

        .divider{
          height:1px;
          background:#e5e7eb;
          margin-top:5px;
        }

        .register-text{
          text-align:center;
          color:#6b7280;
        }

        .register-btn{
          background:transparent;
          color:#2563eb;
        }

        .register-btn:hover{
          text-decoration:underline;
        }

        @media(max-width:480px){
          .login-card{
            padding:25px;
          }

          .login-card h2{
            font-size:24px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
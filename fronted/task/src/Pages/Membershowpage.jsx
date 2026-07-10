import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Compoment/Sidebar.jsx";
import { useNavigate } from "react-router-dom";

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  .layout {
    display: flex;
    min-height: 100vh;
    background: #f8f9fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* ── Main area ── */
  .member-page {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    min-width: 0;
  }

  /* ── Top bar ── */
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 1.75rem;
  }
  .page-header-left h1 {
    font-size: 22px;
    font-weight: 600;
    color: #111827;
  }
  .page-header-left p {
    font-size: 13px;
    color: #9ca3af;
    margin-top: 3px;
  }
  .add-member-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: #111827;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
  }
  .add-member-btn:hover { background: #1f2937; }

  /* ── Search bar ── */
  .search-bar {
    margin-bottom: 1.25rem;
  }
  .search-bar input {
    width: 100%;
    max-width: 340px;
    padding: 9px 14px 9px 36px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 13px;
    color: #374151;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 12px center;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-bar input:focus { border-color: #6366f1; }

  /* ── Table card ── */
  .table-card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 18px;
    overflow: hidden;
  }
  .table-scroll { overflow-x: auto; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  thead tr {
    background: #f9fafb;
    border-bottom: 1px solid #f0f0f0;
  }
  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid #f9fafb;
    transition: background 0.12s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #fafafa; }
  td { padding: 13px 16px; vertical-align: middle; color: #374151; }

  /* ── Avatar cell ── */
  .member-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .member-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f0f0f0;
    flex-shrink: 0;
  }
  .member-avatar-fallback {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .member-name {
    font-weight: 600;
    color: #111827;
    font-size: 13px;
  }

  /* ── Email / Phone ── */
  .td-muted { color: #6b7280; font-size: 13px; }

  /* ── Role badge ── */
  .role-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
  }

  /* ── Action buttons ── */
  .act-btns {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .btn-delete {
    border: none;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    color: #fff;
    background: linear-gradient(135deg, #ff4b5c, #d90429);
    box-shadow: 0 2px 8px rgba(217,4,41,0.2);
    transition: opacity 0.2s, transform 0.15s;
  }
  .btn-delete:hover { opacity: 0.88; transform: translateY(-1px); }

  .btn-update {
    border: none;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    color: #fff;
    background: linear-gradient(135deg, #2196f3, #005bea);
    box-shadow: 0 2px 8px rgba(0,91,234,0.2);
    transition: opacity 0.2s, transform 0.15s;
  }
  .btn-update:hover { opacity: 0.88; transform: translateY(-1px); }

  /* ── States ── */
  .state-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 10px;
    color: #9ca3af;
    font-size: 14px;
  }
  .state-box .state-icon { font-size: 36px; opacity: 0.4; }
  .state-box .state-label { font-weight: 500; color: #6b7280; }

  .spin {
    width: 20px; height: 20px;
    border: 2px solid #e5e7eb;
    border-top-color: #6b7280;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 4px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    z-index: 9999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: slideUp 0.25s ease;
  }
  .toast.success { background: #16a34a; }
  .toast.error   { background: #dc2626; }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .layout { flex-direction: column; }
    .member-page { padding: 1rem; }
    table { min-width: 680px; }
  }
`;

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Membershowpage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [toast,   setToast]   = useState(null); // { msg, type }

  useEffect(() => { getMembers(); }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function getMembers() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/members/`,
        {
           withCredentials: true
        }
      );
      if (res.data.success) {
        setMembers(res.data.data || res.data.members || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deletebyid(id) {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/members/deletemember`, { data: { id } });
      setMembers((prev) => prev.filter((m) => m._id !== id));
      showToast("Member deleted successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Delete failed. Please try again.", "error");
    }
  }

  const filtered = members.filter((m) =>
    !search ||
    (m.fullName  || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.email     || "").toLowerCase().includes(search.toLowerCase()) ||
    (m.role      || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>

      <div className="layout">
        <Sidebar />

        <div className="member-page">

          {/* Header */}
          <div className="page-header">
            <div className="page-header-left">
              <h1>All Members</h1>
              <p>{members.length} member{members.length !== 1 ? "s" : ""} registered</p>
            </div>
            <a href="/createmember" className="add-member-btn">+ Add Member</a>
          </div>

          {/* Search */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, email or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-card">
            <div className="table-scroll">
              {loading ? (
                <div className="state-box">
                  <div className="spin" />
                  <span className="state-label">Loading members…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="state-box">
                  <span className="state-icon">👥</span>
                  <span className="state-label">
                    {search ? "No members match your search." : "No members found."}
                  </span>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Member</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, index) => (
                      <tr key={item._id}>
                        <td className="td-muted">{index + 1}</td>

                        <td>
                          <div className="member-cell">
                            {item.profilePicture ? (
                              <img
                                src={item.profilePicture}
                                alt={item.fullName}
                                className="member-avatar"
                              />
                            ) : (
                              <div className="member-avatar-fallback">
                                {getInitials(item.fullName)}
                              </div>
                            )}
                            <span className="member-name">{item.fullName}</span>
                          </div>
                        </td>

                        <td className="td-muted">{item.email}</td>
                        <td className="td-muted">{item.phoneNo || "—"}</td>

                        <td>
                          <span className="role-badge">{item.role || "Member"}</span>
                        </td>

                        <td>
                          <div className="act-btns">
                            <button
                              className="btn-delete"
                              onClick={() => deletebyid(item._id)}
                            >
                              Delete
                            </button>
                            <button
                              className="btn-update"
                              onClick={() => navigate(`/updatemember/${item._id}`)}
                            >
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}
    </>
  );
}
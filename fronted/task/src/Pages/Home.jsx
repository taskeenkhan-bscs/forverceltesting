import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Compoment/Sidebar.jsx";
import { useNavigate } from "react-router-dom";

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dash { display: flex; min-height: 100vh; background: #f8f9fa; }
  .main { flex: 1; padding: 1.5rem; overflow-y: auto; min-width: 0; }

  .topbar { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 1.5rem; }
  .topbar h1 { font-size: 22px; font-weight: 600; color: #111827; }
  .topbar p  { font-size: 13px; color: #9ca3af; margin-top: 3px; }

  .add-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 500;
    background: #111827; color: #fff; border: none; cursor: pointer;
    text-decoration: none; transition: background .15s;
  }
  .add-btn:hover { background: #1f2937; }

  /* ── Stats ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 1.5rem;
  }
  .stat-card {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 14px;
    padding: 1.1rem 1.2rem;
    position: relative;
    overflow: hidden;
  }
  .stat-card .s-icon {
    position: absolute; right: 12px; top: 12px;
    font-size: 26px; opacity: .12;
  }
  .stat-label { font-size: 12px; color: #9ca3af; margin-bottom: 6px; }
  .stat-value { font-size: 28px; font-weight: 700; color: #111827; }
  .stat-sub   { font-size: 11px; color: #9ca3af; margin-top: 4px; }

  .stat-card.blue   .stat-value { color: #185FA5; }
  .stat-card.green  .stat-value { color: #3B6D11; }
  .stat-card.amber  .stat-value { color: #854F0B; }
  .stat-card.purple .stat-value { color: #534AB7; }

  /* ── Filters ── */
  .section-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: .75rem; }
  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1rem; align-items: center; }
  .filters input,
  .filters select {
    font-size: 13px; padding: 8px 12px;
    border-radius: 10px; border: 1px solid #e5e7eb;
    background: #fff; color: #374151; outline: none;
  }
  .filters input  { min-width: 200px; flex: 1; }
  .filters select { min-width: 140px; }
  .filters input:focus,
  .filters select:focus { border-color: #6366f1; }

  /* ── Table ── */
  .table-wrap { background: #fff; border: 1px solid #f0f0f0; border-radius: 18px; overflow: hidden; }
  .tbl-scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }

  thead tr { background: #f9fafb; border-bottom: 1px solid #f0f0f0; }
  th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }

  tbody tr { border-bottom: 1px solid #f9fafb; transition: background .12s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #fafafa; }
  td { padding: 12px 16px; vertical-align: middle; color: #374151; }
  .td-title { font-weight: 600; color: #111827; }
  .td-muted { color: #9ca3af; }

  /* Badges */
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; border: 1px solid; }
  .b-high     { background:#fef2f2; color:#991b1b; border-color:#fecaca; }
  .b-medium   { background:#fffbeb; color:#92400e; border-color:#fde68a; }
  .b-low      { background:#f0fdf4; color:#166534; border-color:#bbf7d0; }
  .b-done     { background:#f0fdf4; color:#166534; border-color:#bbf7d0; }
  .b-progress { background:#fffbeb; color:#92400e; border-color:#fde68a; }
  .b-pending  { background:#f5f3ff; color:#4c1d95; border-color:#ddd6fe; }

  /* Avatar */
  .assignee { display: flex; align-items: center; gap: 7px; }
  .avatar   { width: 26px; height: 26px; border-radius: 50%; background: #dbeafe; color: #1d4ed8; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }

  /* Action buttons */
  .act-btns { display: flex; gap: 6px; }
  .act-btns button { border: none; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; color: #fff; transition: opacity .2s; }
  .del-btn { background: linear-gradient(135deg,#ff4b5c,#d90429); }
  .del-btn:hover { opacity: .85; }
  .upd-btn { background: linear-gradient(135deg,#2196f3,#005bea); }
  .upd-btn:hover { opacity: .85; }

  .empty-state { text-align: center; padding: 3rem; color: #9ca3af; font-size: 14px; }

  @media (max-width: 768px) {
    .dash { flex-direction: column; }
    .main { padding: 1rem; }
    table { min-width: 700px; }
  }
`;

function priorityClass(p) {
  return p === "High" ? "badge b-high" : p === "Medium" ? "badge b-medium" : "badge b-low";
}
function statusClass(s) {
  return s === "Completed" ? "badge b-done" : s === "In Progress" ? "badge b-progress" : "badge b-pending";
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Home() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("");
  const [priorityF, setPriorityF] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/projects`),
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/getmember`),
    ])
      .then(([pRes, mRes]) => {
        setProjects(pRes.data.data || []);
        setMembers(mRes.data.data || mRes.data.members || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function deleteProject(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete`, { id });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  }

  const filtered = projects.filter((p) => {
    const matchQ = !search || (p.title || "").toLowerCase().includes(search.toLowerCase());
    const matchSt = !statusF || p.status === statusF;
    const matchPr = !priorityF || p.priority === priorityF;
    return matchQ && matchSt && matchPr;
  });

  const total = projects.length;
  const done = projects.filter((p) => p.status === "Completed").length;
  const progress = projects.filter((p) => p.status === "In Progress").length;
  const pending = projects.filter((p) => p.status === "Pending").length;

  return (
    <>
      <style>{styles}</style>

      <div className="dash">
        <Sidebar />

        <div className="main">

          {/* Top bar */}
          <div className="topbar">
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back, Admin</p>
            </div>
            <a href="/addproject" className="add-btn">+ Add project</a>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-label">Total projects</div>
              <div className="stat-value">{total}</div>
              <div className="stat-sub">All projects</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Completed</div>
              <div className="stat-value">{done}</div>
              <div className="stat-sub">Finished</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-label">In progress</div>
              <div className="stat-value">{progress}</div>
              <div className="stat-sub">Active now</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Pending</div>
              <div className="stat-value">{pending}</div>
              <div className="stat-sub">Not started</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Total members</div>
              <div className="stat-value">{members.length}</div>
              <div className="stat-sub">Registered</div>
            </div>
          </div>

          {/* Filters */}
          <div className="section-title">Projects</div>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)}>
              <option value="">All statuses</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Pending</option>
            </select>
            <select value={priorityF} onChange={(e) => setPriorityF(e.target.value)}>
              <option value="">All priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Table */}
          <div className="table-wrap">
            <div className="tbl-scroll">
              {loading ? (
                <div className="empty-state">Loading…</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      {["#", "Title", "Category", "Priority", "Status", "Deadline", "Member", "Actions"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="empty-state">No projects match your filters.</td>
                      </tr>
                    ) : (
                      filtered.map((item, index) => (
                        <tr key={item._id}>
                          <td className="td-muted">{index + 1}</td>
                          <td className="td-title">{item.title}</td>
                          <td className="td-muted">{item.category || "—"}</td>
                          <td><span className={priorityClass(item.priority)}>{item.priority}</span></td>
                          <td><span className={statusClass(item.status)}>{item.status}</span></td>
                          <td className="td-muted">{fmtDate(item.deadline)}</td>
                          <td>
                            {item.member ? (
                              <div className="assignee">
                                <div className="avatar">{getInitials(item.member.fullName)}</div>
                                <span>{item.member.fullName}</span>
                              </div>
                            ) : (
                              <span className="td-muted">—</span>
                            )}
                          </td>
                          <td>
                            <div className="act-btns">
                              <button className="del-btn" onClick={() => deleteProject(item._id)}>Delete</button>
                              <button className="upd-btn" onClick={() => navigate(`/update/${item._id}`)}>Update</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
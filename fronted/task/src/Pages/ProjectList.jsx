import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Compoment/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import Projectdetail from "../Compoment/Projectdetail.jsx";

const styles = ` 
 
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.action-buttons button {
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn {
  background-color: #e74c3c;
}

.delete-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.update-btn {
  background-color: #3498db;
}

.update-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}
  .pl-page { display: flex; min-height: 100vh; background: #f8f9fa; }
  .pl-main { flex: 1; padding: 2rem; overflow-y: auto; }

  /* Header */
  .pl-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 1.5rem; }
  .pl-header h1 { font-size: 22px; font-weight: 600; color: #111827; margin: 0; }
  .pl-header p { font-size: 13px; color: #9ca3af; margin: 4px 0 0; }

  /* Add button */
  .pl-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 500; background: #111827; border: none; color: #fff; cursor: pointer; text-decoration: none; transition: background 0.15s; }
  .pl-add-btn:hover { background: #1f2937; }

  /* Table */
  .pl-table-wrap { background: #fff; border: 1px solid #f0f0f0; border-radius: 18px; overflow: hidden; }
  .pl-table-scroll { overflow-x: auto; }
  .pl-table { width: 100%; border-collapse: collapse; font-size: 13px; }

  .pl-table thead tr { background: #f9fafb; border-bottom: 1px solid #f0f0f0; }
  .pl-table th { padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }

  .pl-table tbody tr { border-bottom: 1px solid #f9fafb; transition: background 0.12s; }
  .pl-table tbody tr:last-child { border-bottom: none; }
  .pl-table tbody tr:hover { background: #fafafa; }
  .pl-table td { padding: 13px 20px; vertical-align: middle; color: #374151; }

  .pl-td-title { font-weight: 600; color: #111827; font-size: 13px; }
  .pl-td-muted { color: #9ca3af; font-size: 13px; }

  /* Badge */
  .pl-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; border: 1px solid; }
  .pl-badge-low      { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
  .pl-badge-medium   { background: #fffbeb; color: #92400e; border-color: #fde68a; }
  .pl-badge-high     { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
  .pl-badge-pending  { background: #f5f3ff; color: #4c1d95; border-color: #ddd6fe; }
  .pl-badge-progress { background: #fffbeb; color: #92400e; border-color: #fde68a; }
  .pl-badge-done     { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }

  /* Avatar */
  .pl-assignee { display: flex; align-items: center; gap: 7px; }
  .pl-avatar { width: 26px; height: 26px; border-radius: 50%; background: #dbeafe; color: #1d4ed8; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
  .pl-assignee-name { font-size: 13px; color: #374151; }

  /* Image cell */
  .pl-tbl-img { width: 36px; height: 36px; border-radius: 9px; object-fit: cover; border: 1px solid #f0f0f0; display: block; }
  .pl-tbl-img-empty { width: 36px; height: 36px; border-radius: 9px; background: #f9fafb; border: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 15px; }

  /* Loading */
  .pl-loading { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 6rem 0; color: #9ca3af; font-size: 14px; }
  .pl-spin { width: 18px; height: 18px; border: 2px solid #e5e7eb; border-top-color: #6b7280; border-radius: 50%; animation: pl-spin 0.7s linear infinite; }
  @keyframes pl-spin { to { transform: rotate(360deg); } }

  /* Error */
  .pl-error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 14px; padding: 14px 18px; font-size: 13px; }

  /* Empty */
  .pl-empty { padding: 4rem 2rem; text-align: center; color: #9ca3af; font-size: 14px; }
  .pl-empty a { color: #4f46e5; text-decoration: none; }
  .pl-empty a:hover { text-decoration: underline; }
`;




function priorityClass(p) {
  return p === "High" ? "pl-badge pl-badge-high"
    : p === "Medium" ? "pl-badge pl-badge-medium"
      : "pl-badge pl-badge-low";
}
function statusClass(s) {
  return s === "Completed" ? "pl-badge pl-badge-done"
    : s === "In Progress" ? "pl-badge pl-badge-progress"
      : "pl-badge pl-badge-pending";
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [visbabality, setvisibility] = useState(false)
  const [projecttdata, setprojectdata] = useState({})


useEffect(() => {
  async function getProjects() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/projects`,
        {
          withCredentials: true,
        }
      );

      setProjects(res.data.data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  getProjects();
}, []);



  async function deletebyid(id) {
    try {
      let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/projects/delete`, { id });

      console.log(res.data);

      // ✅ refresh UI after delete
      setProjects((prev) => prev.filter((item) => item._id !== id));

    } catch (error) {
      console.log(error.message);
    }
  }



  return (
    <>
      <style>{styles}</style>

      <div className="pl-page">
        <Sidebar />

        {
          visbabality && (
            <Projectdetail
              setvisibility={setvisibility}
              project={projecttdata}
            />
          )
        }

        <div className="pl-main">

          {/* Header */}
          <div className="pl-header">
            <div>
              <h1>Projects</h1>
              <p>All your active projects in one place.</p>
            </div>
            <a href="/addproject" className="pl-add-btn">+ Add project</a>
          </div>

          {/* Loading */}
          {loading && (
            <div className="pl-loading">
              <div className="pl-spin" />
              Loading projects…
            </div>
          )}

          {/* Error */}
          {error && <div className="pl-error">⚠️ {error}</div>}

          {/* Table */}
          {!loading && !error && (
            <div className="pl-table-wrap">
              <div className="pl-table-scroll">
                <table className="pl-table">
                  <thead>
                    <tr>
                      {["#", "Title", "Category", "Priority", "Status", "Deadline", "Member", "Image", "Action"].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((item, index) => (
                      <tr key={item._id}>

                        <td className="pl-td-muted">{index + 1}</td>

                        <td className="pl-td-title">{item.title}</td>

                        <td className="pl-td-muted">{item.category}</td>

                        <td>
                          <span className={priorityClass(item.priority)}>{item.priority}</span>
                        </td>

                        <td>
                          <span className={statusClass(item.status)}>{item.status}</span>
                        </td>

                        <td className="pl-td-muted">{fmtDate(item.deadline)}</td>

                        <td>
                          {item.member ? (
                            <div className="pl-assignee">
                              <div className="pl-avatar">
                                {getInitials(item.member.fullName)}
                              </div>
                              <span className="pl-assignee-name">
                                {item.member.fullName}
                              </span>
                            </div>
                          ) : (
                            <span className="pl-td-muted">—</span>
                          )}
                        </td>


                        <td>
                          {item.picture ? (

                            <img
                              src={item.picture}
                              alt="project"
                              className="pl-tbl-img"
                            />

                          ) : (

                            <div className="pl-tbl-img-empty">
                              📷
                            </div>

                          )}
                        </td>
                        <td className="action-buttons">

                          <button
                            className="update-btn"
                            onClick={() => {
                              setprojectdata(item);
                              setvisibility(true);
                            }}
                          >
                            Details
                          </button>

                          <button
                            className="update-btn"
                            onClick={() => navigate(`/update/${item._id}`)}
                          >
                            Update
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deletebyid(item._id)}
                          >
                            Delete
                          </button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {projects.length === 0 && (
                  <div className="pl-empty">
                    No projects yet. <a href="/addproject">Add your first one →</a>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
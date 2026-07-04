import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const styles = `
.pd-container{
  min-height:100vh;
  background:#f4f5f7;
  padding:40px 20px;
  display:flex;
  justify-content:center;
}

.pd-card{
  width:100%;
  max-width:880px;
  background:#ffffff;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.08);
}

.pd-header{
  display:flex;
  align-items:flex-start;
  gap:18px;
  padding:24px 32px;
  border-bottom:1px solid #edeef1;
}

.pd-image-wrap{
  position:relative;
  width:72px;
  height:72px;
  border-radius:14px;
  overflow:hidden;
  background:#eef0f3;
  flex-shrink:0;
}

.pd-image{
  width:100%;
  height:100%;
  object-fit:cover;
  display:block;
}

.pd-header-text{
  flex:1;
  min-width:0;
}

.pd-eyebrow{
  font-size:12px;
  font-weight:600;
  letter-spacing:0.06em;
  text-transform:uppercase;
  color:#8a8f98;
  margin:0 0 6px;
}

.pd-title{
  font-size:24px;
  line-height:1.3;
  font-weight:700;
  color:#1a1d23;
  margin:0 0 12px;
  word-break:break-word;
}

.pd-badges{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}

.pd-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  font-size:13px;
  font-weight:600;
  padding:5px 12px;
  border-radius:999px;
  line-height:1.4;
}

.pd-badge-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  flex-shrink:0;
}

/* status colors */
.status-completed{ background:#e7f6ec; color:#1d7a3d; }
.status-completed .pd-badge-dot{ background:#1d7a3d; }

.status-in-progress, .status-inprogress, .status-active{ background:#e8f0fe; color:#1a56db; }
.status-in-progress .pd-badge-dot, .status-inprogress .pd-badge-dot, .status-active .pd-badge-dot{ background:#1a56db; }

.status-pending, .status-onhold, .status-on-hold{ background:#fdf3e3; color:#9a6700; }
.status-pending .pd-badge-dot, .status-onhold .pd-badge-dot, .status-on-hold .pd-badge-dot{ background:#9a6700; }

.status-cancelled, .status-blocked{ background:#fdeaea; color:#c0282d; }
.status-cancelled .pd-badge-dot, .status-blocked .pd-badge-dot{ background:#c0282d; }

.status-default{ background:#f1f2f4; color:#5a5f6a; }
.status-default .pd-badge-dot{ background:#5a5f6a; }

/* priority colors */
.priority-high, .priority-urgent{ background:#fdeaea; color:#c0282d; }
.priority-high .pd-badge-dot, .priority-urgent .pd-badge-dot{ background:#c0282d; }

.priority-medium{ background:#fdf3e3; color:#9a6700; }
.priority-medium .pd-badge-dot{ background:#9a6700; }

.priority-low{ background:#e7f6ec; color:#1d7a3d; }
.priority-low .pd-badge-dot{ background:#1d7a3d; }

.pd-body{
  padding:28px 32px 32px;
}

.pd-section{
  margin-bottom:24px;
}

.pd-section:last-child{
  margin-bottom:0;
}

.pd-section h4{
  font-size:13px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:0.04em;
  color:#8a8f98;
  margin:0 0 8px;
}

.pd-section p{
  margin:0;
  font-size:15px;
  line-height:1.65;
  color:#3a3e46;
}

.pd-grid{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:16px;
}

.pd-stat{
  background:#f8f9fb;
  border:1px solid #edeef1;
  border-radius:12px;
  padding:16px 18px;
}

.pd-stat h4{
  font-size:12px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:0.04em;
  color:#8a8f98;
  margin:0 0 6px;
}

.pd-stat p{
  margin:0;
  font-size:15px;
  font-weight:600;
  color:#1a1d23;
}

.pd-member{
  display:flex;
  align-items:center;
  gap:12px;
  background:#f8f9fb;
  border:1px solid #edeef1;
  border-radius:12px;
  padding:14px 16px;
}

.pd-avatar{
  width:38px;
  height:38px;
  border-radius:50%;
  background:#1a56db;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:14px;
  font-weight:700;
  flex-shrink:0;
}

.pd-member-name{
  font-size:15px;
  font-weight:600;
  color:#1a1d23;
}

.pd-member-label{
  font-size:12px;
  color:#8a8f98;
  margin-bottom:2px;
}

/* loading state */
.pd-skeleton-line{
  background:linear-gradient(90deg, #eceef1 25%, #f5f6f8 37%, #eceef1 63%);
  background-size:400% 100%;
  animation:pd-shimmer 1.4s ease infinite;
  border-radius:6px;
}

@keyframes pd-shimmer{
  0%{ background-position:100% 50%; }
  100%{ background-position:0 50%; }
}

/* error state */
.pd-error{
  text-align:center;
  padding:60px 32px;
}

.pd-error h3{
  font-size:18px;
  color:#1a1d23;
  margin:0 0 8px;
}

.pd-error p{
  font-size:14px;
  color:#8a8f98;
  margin:0 0 20px;
}

.pd-retry-btn{
  border:1px solid #d8dbe0;
  background:#fff;
  color:#1a1d23;
  font-size:14px;
  font-weight:600;
  padding:9px 18px;
  border-radius:8px;
  cursor:pointer;
}

.pd-retry-btn:hover{
  background:#f8f9fb;
}

.pd-retry-btn:focus-visible{
  outline:2px solid #1a56db;
  outline-offset:2px;
}

@media(max-width:768px){
  .pd-container{
    padding:20px 12px;
  }

  .pd-header, .pd-body{
    padding:20px;
  }

  .pd-header{
    gap:14px;
  }

  .pd-image-wrap{
    width:56px;
    height:56px;
    border-radius:12px;
  }

  .pd-title{
    font-size:20px;
  }

  .pd-grid{
    grid-template-columns:1fr 1fr;
  }
}

@media(max-width:480px){
  .pd-header{
    flex-direction:column;
    align-items:flex-start;
  }

  .pd-grid{
    grid-template-columns:1fr;
  }

  .pd-title{
    font-size:19px;
  }
}

@media (prefers-reduced-motion: reduce){
  .pd-skeleton-line{
    animation:none;
  }
}
`;

function statusClass(status) {
  if (!status) return "status-default";
  const key = status.toLowerCase().replace(/\s+/g, "-");
  return ["status-completed", "status-in-progress", "status-inprogress", "status-active",
    "status-pending", "status-onhold", "status-on-hold", "status-cancelled", "status-blocked"]
    .includes(key) ? key : "status-default";
}

function priorityClass(priority) {
  if (!priority) return "status-default";
  const key = priority.toLowerCase().replace(/\s+/g, "-");
  return ["priority-high", "priority-urgent", "priority-medium", "priority-low"]
    .includes(key) ? key : "status-default";
}

function formatDeadline(deadline) {
  if (!deadline) return "No deadline set";
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function ProjectDetailspage() {
  const params = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function getSingleProject() {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/modernproject`, {
        _id: params.id,
      });

      if (res.data.success) {
        setProject(res.data.project);
      } else {
        setError(true);
      }
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSingleProject();
  }, [params.id]);

  return (
    <>
      <style>{styles}</style>

      <div className="pd-container">
        <div className="pd-card">
          {loading && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "24px 32px" }}>
                <div className="pd-skeleton-line" style={{ width: 72, height: 72, borderRadius: 14, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="pd-skeleton-line" style={{ height: 22, width: "55%", marginBottom: 12 }} />
                  <div className="pd-skeleton-line" style={{ height: 14, width: "30%" }} />
                </div>
              </div>
              <div className="pd-body" style={{ paddingTop: 0 }}>
                <div className="pd-skeleton-line" style={{ height: 16, width: "90%", marginBottom: 10 }} />
                <div className="pd-skeleton-line" style={{ height: 16, width: "80%", marginBottom: 24 }} />
                <div className="pd-grid">
                  <div className="pd-skeleton-line" style={{ height: 60 }} />
                  <div className="pd-skeleton-line" style={{ height: 60 }} />
                  <div className="pd-skeleton-line" style={{ height: 60 }} />
                </div>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="pd-error">
              <h3>Couldn't load this project</h3>
              <p>Something went wrong while fetching the details. Check your connection and try again.</p>
              <button className="pd-retry-btn" onClick={getSingleProject}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && project && (
            <>
              <div className="pd-header">
                {project.picture && (
                  <div className="pd-image-wrap">
                    <img src={project.picture} alt={project.title || "Project"} className="pd-image" />
                  </div>
                )}

                <div className="pd-header-text">
                  {project.category && <p className="pd-eyebrow">{project.category}</p>}
                  <h2 className="pd-title">{project.title || "Untitled project"}</h2>

                  <div className="pd-badges">
                    {project.status && (
                      <span className={`pd-badge ${statusClass(project.status)}`}>
                        <span className="pd-badge-dot" />
                        {project.status}
                      </span>
                    )}
                    {project.priority && (
                      <span className={`pd-badge ${priorityClass(project.priority)}`}>
                        <span className="pd-badge-dot" />
                        {project.priority} priority
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pd-body">
                {project.description && (
                  <div className="pd-section">
                    <h4>Description</h4>
                    <p>{project.description}</p>
                  </div>
                )}

                <div className="pd-section">
                  <div className="pd-grid">
                    <div className="pd-stat">
                      <h4>Deadline</h4>
                      <p>{formatDeadline(project.deadline)}</p>
                    </div>
                    <div className="pd-stat">
                      <h4>Status</h4>
                      <p>{project.status || "Not set"}</p>
                    </div>
                    <div className="pd-stat">
                      <h4>Priority</h4>
                      <p>{project.priority || "Not set"}</p>
                    </div>
                  </div>
                </div>

                {project.member?.fullName && (
                  <div className="pd-section">
                    <h4>Assigned to</h4>
                    <div className="pd-member">
                      <div className="pd-avatar">{initials(project.member.fullName)}</div>
                      <div>
                        <div className="pd-member-label">Team member</div>
                        <div className="pd-member-name">{project.member.fullName}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectDetailspage;
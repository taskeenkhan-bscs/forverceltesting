import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Tasklist({ projectId: projectIdProp, onStats }) {
  const { projectId: projectIdParam } = useParams();
  const projectId = projectIdProp || projectIdParam;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) {
      setError("No project selected.");
      setLoading(false);
      if (onStats) onStats({ total: 0, inProgress: 0, done: 0, overdue: 0 });
      return;
    }

  const fetchTasks = async () => {
  setLoading(true);
  setError("");

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/tasks/${projectId}`,
      {
        withCredentials: true,
      }
    );

    const list = res.data.tasks || [];
    setTasks(list);

    if (onStats) {
      const now = new Date();

      const counts = list.reduce(
        (acc, t) => {
          const status = (t.status || "").toLowerCase();

          if (status === "done") {
            acc.done++;
          } else if (status === "in progress") {
            acc.inProgress++;
          }

          if (
            t.deadline &&
            status !== "done" &&
            new Date(t.deadline) < now
          ) {
            acc.overdue++;
          }

          return acc;
        },
        {
          done: 0,
          inProgress: 0,
          overdue: 0,
        }
      );

      onStats({
        total: list.length,
        ...counts,
      });
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);

    setError("Failed to load tasks. Please try again.");

    if (onStats) {
      onStats({
        total: 0,
        done: 0,
        inProgress: 0,
        overdue: 0,
      });
    }
  } finally {
    setLoading(false);
  }
};

    fetchTasks();
  }, [projectId, onStats]);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dateStr, status) => {
    if (!dateStr || status === "Done") return false;
    return new Date(dateStr) < new Date();
  };

  const initials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="tl-page">
      <header className="tl-header">
        <div>
          <h1 className="tl-title">Tasks</h1>
          <p className="tl-subtitle">
            {loading
              ? "Loading your work..."
              : `${tasks.length} task${tasks.length === 1 ? "" : "s"} total`}
          </p>
        </div>
      </header>

      {loading && (
        <div className="tl-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="tl-card tl-skeleton" aria-hidden="true">
              <div className="tl-skel-line tl-skel-title" />
              <div className="tl-skel-line tl-skel-text" />
              <div className="tl-skel-line tl-skel-text tl-skel-short" />
              <div className="tl-skel-footer">
                <div className="tl-skel-pill" />
                <div className="tl-skel-pill" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="tl-state tl-state-error">
          <div className="tl-state-icon">!</div>
          <p className="tl-state-title">Couldn't load tasks</p>
          <p className="tl-state-body">{error}</p>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="tl-state">
          <div className="tl-state-icon">○</div>
          <p className="tl-state-title">No tasks yet</p>
          <p className="tl-state-body">Tasks you create will show up here.</p>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="tl-grid">
          {tasks.map((t) => {
            const overdue = isOverdue(t.deadline, t.status);
            return (
              <article key={t._id} className="tl-card">
                <div className="tl-card-top">
                  <span className={`tl-priority tl-priority-${(t.priority || "medium").toLowerCase()}`}>
                    {t.priority}
                  </span>
                  <span className={`tl-status tl-status-${(t.status || "todo").toLowerCase().replace(/\s+/g, "-")}`}>
                    {t.status}
                  </span>
                </div>

                <h2 className="tl-card-title">{t.title}</h2>

                {t.description && (
                  <p className="tl-card-desc">{t.description}</p>
                )}

                <div className="tl-card-footer">
                  <div className="tl-meta-row">
                    {t.deadline ? (
                      <span className={`tl-deadline ${overdue ? "tl-deadline-overdue" : ""}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {formatDate(t.deadline)}
                        {overdue && <span className="tl-overdue-tag">Overdue</span>}
                      </span>
                    ) : (
                      <span className="tl-deadline tl-deadline-none">No deadline</span>
                    )}

                    {t.assignedTo?.fullName && (
                      <span className="tl-assignee">
                        <span className="tl-avatar">{initials(t.assignedTo.fullName)}</span>
                        {t.assignedTo.fullName}
                      </span>
                    )}
                  </div>

                  {t.createdAt && (
                    <span className="tl-created">
                      Created {formatDate(t.createdAt)}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style>{styles}</style>
    </div>
  );
}

const styles = `
.tl-page {
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
}

.tl-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.tl-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #14151a;
  margin: 0 0 4px;
}

.tl-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.tl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.tl-card {
  background: #ffffff;
  border: 1px solid #e8e8e5;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}

.tl-card:hover {
  border-color: #d4d4d0;
  box-shadow: 0 4px 16px rgba(20, 21, 26, 0.06);
  transform: translateY(-1px);
}

.tl-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.tl-priority {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 6px;
}

.tl-priority-low { background: #eef6ee; color: #2f7a3c; }
.tl-priority-medium { background: #fef6e7; color: #966a13; }
.tl-priority-high { background: #fdeee5; color: #b34d10; }
.tl-priority-urgent { background: #fdebeb; color: #c41e1e; }

.tl-status {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 3px 9px;
  border-radius: 6px;
  border: 1px solid transparent;
  white-space: nowrap;
}

.tl-status-todo { background: #f1f2f4; color: #4b5160; border-color: #e2e3e7; }
.tl-status-in-progress { background: #eaf1fd; color: #1d5fc9; border-color: #d6e4fa; }
.tl-status-in-review { background: #f4eefd; color: #7e3fd1; border-color: #e7daf9; }
.tl-status-done { background: #eaf8ef; color: #1e8a4c; border-color: #d6f0e0; }

.tl-card-title {
  font-size: 16px;
  font-weight: 650;
  color: #14151a;
  margin: 0;
  line-height: 1.35;
}

.tl-card-desc {
  font-size: 13.5px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tl-card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0ee;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tl-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.tl-deadline {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: #4b5160;
  font-weight: 500;
}

.tl-deadline svg {
  flex-shrink: 0;
  color: #9a9ca3;
}

.tl-deadline-none {
  color: #b0b2b8;
  font-style: italic;
}

.tl-deadline-overdue {
  color: #c41e1e;
}

.tl-deadline-overdue svg {
  color: #c41e1e;
}

.tl-overdue-tag {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: #fdebeb;
  color: #c41e1e;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 2px;
}

.tl-assignee {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: #4b5160;
  font-weight: 500;
}

.tl-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #14151a;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tl-created {
  font-size: 11px;
  color: #b0b2b8;
}

/* Empty / error states */
.tl-state {
  text-align: center;
  padding: 72px 24px;
  background: #ffffff;
  border: 1px dashed #e2e3e7;
  border-radius: 14px;
}

.tl-state-error {
  border-color: #f5d4d4;
  background: #fef9f9;
}

.tl-state-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f1f2f4;
  color: #9a9ca3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  font-size: 15px;
  font-weight: 700;
}

.tl-state-error .tl-state-icon {
  background: #fdebeb;
  color: #c41e1e;
}

.tl-state-title {
  font-size: 15px;
  font-weight: 650;
  color: #14151a;
  margin: 0 0 4px;
}

.tl-state-body {
  font-size: 13.5px;
  color: #6b7280;
  margin: 0;
}

/* Skeleton loading */
.tl-skeleton {
  cursor: default;
}

.tl-skeleton:hover {
  transform: none;
  box-shadow: none;
  border-color: #e8e8e5;
}

.tl-skel-line {
  background: linear-gradient(90deg, #eeeeec 25%, #f5f5f3 50%, #eeeeec 75%);
  background-size: 200% 100%;
  animation: tl-shimmer 1.4s ease-in-out infinite;
  border-radius: 5px;
  height: 11px;
}

.tl-skel-title {
  height: 15px;
  width: 70%;
  margin-bottom: 2px;
}

.tl-skel-text {
  width: 100%;
}

.tl-skel-short {
  width: 55%;
}

.tl-skel-footer {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  padding-top: 12px;
  border-top: 1px solid #f0f0ee;
}

.tl-skel-pill {
  height: 20px;
  width: 70px;
  border-radius: 6px;
  background: linear-gradient(90deg, #eeeeec 25%, #f5f5f3 50%, #eeeeec 75%);
  background-size: 200% 100%;
  animation: tl-shimmer 1.4s ease-in-out infinite;
}

@keyframes tl-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .tl-skel-line, .tl-skel-pill {
    animation: none;
  }
  .tl-card {
    transition: none;
  }
}

@media (max-width: 600px) {
  .tl-grid {
    grid-template-columns: 1fr;
  }
  .tl-title {
    font-size: 19px;
  }
}
`;

export default Tasklist;
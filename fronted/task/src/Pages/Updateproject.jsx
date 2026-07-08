import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Compoment/Sidebar.jsx";

function Projectupdate() {
  const navigate = useNavigate();
  const params = useParams();

  const [members, setMembers] = useState([]);

  const [proj, setProj] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    status: "",
    deadline: "",
    member: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  async function GetSingleProject() {
    try {
      setFetching(true);
      let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/projects/modernproject`, { _id: params.id });
      console.log("API Response:", res.data);

      if (res.data.success && res.data.project) {
        let p = res.data.project;
        setProj({
          title:       p.title       || "",
          description: p.description || "",
          category:    p.category    || "",
          priority:    p.priority    || "Medium",
          status:      p.status      || "Pending",
          deadline:    p.deadline ? p.deadline.substring(0, 10) : "",
          member:      p.member?._id || p.member || ""
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  }

  // ✅ correct route + correct field name
  async function getMembers() {
    try {
      let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/members/getmember`);
      if (res.data.success) {
        setMembers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function validate() {
    const e = {};
    if (!proj.title.trim())    e.title    = "Required";
    if (!proj.category.trim()) e.category = "Required";
    if (!proj.status.trim())   e.status   = "Required";
    if (!proj.priority.trim()) e.priority = "Required";
    return e;
  }

  async function Update() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      let res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/projects/updateproject`, {
        ...proj,
        _id: params.id
      });
      console.log(res.data);
      if (res.data.success === true) {
        navigate("/projectshow");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function field(key, value) {
    setProj({ ...proj, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  }

  function focusIn(e) {
    e.currentTarget.style.borderColor = '#10b981';
    e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(16,185,129,0.12)';
    e.currentTarget.style.background  = '#fff';
  }
  function focusOut(e, key) {
    e.currentTarget.style.borderColor = errors[key] ? '#fca5a5' : '#e2e8f0';
    e.currentTarget.style.boxShadow   = 'none';
  }

  const inputStyle = (key) => ({
    ...styles.input,
    ...(errors[key] ? styles.inputError : {}),
  });

  useEffect(() => {
    GetSingleProject();
    getMembers();
  }, []);

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Update Project</h1>
            <p style={styles.subheading}>Edit and save changes to your project</p>
          </div>
          <button
            onClick={() => navigate('/projectshow')}
            style={styles.viewBtn}
            onMouseEnter={e => { e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; }}
          >
            📋 View Projects
          </button>
        </div>

        <div style={styles.statsBar}>
          <div style={styles.statChip}>
            <span style={{ ...styles.statDot, background: '#10b981' }} />
            <span style={styles.statText}>Editing Project</span>
          </div>
        </div>

        <div style={styles.cardWrap}>
          <div style={styles.card}>
            <div style={styles.cardAccent} />
            <div style={styles.cardBody}>

              <div style={styles.cardHeader}>
                <div style={styles.iconCircle}>
                  <span style={{ fontSize: '26px' }}>✏️</span>
                </div>
                <div>
                  <h2 style={styles.cardTitle}>Edit Project Details</h2>
                  <p style={styles.cardSubtitle}>Update the fields below and save your changes</p>
                </div>
              </div>

              <div style={styles.divider} />

              {fetching ? (
                <div style={styles.loadingWrap}>
                  <div style={styles.spinner} />
                  <p style={styles.loadingText}>Loading project data...</p>
                </div>
              ) : (
                <>
                  <div style={styles.grid}>

                    {/* Title */}
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        placeholder="e.g. Portfolio Website"
                        style={inputStyle('title')}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, 'title')}
                        onChange={e => field('title', e.target.value)}
                      />
                      {errors.title && <p style={styles.errorMsg}>⚠ {errors.title}</p>}
                    </div>

                    {/* Category */}
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Category</label>
                      <select
                        value={proj.category}
                        style={inputStyle('category')}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, 'category')}
                        onChange={e => field('category', e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option value="App">App</option>
                        <option value="Web">Web</option>
                        <option value="Game">Game</option>
                        <option value="Desktop">Desktop</option>
                        <option value="AI">AI</option>
                      </select>
                      {errors.category && <p style={styles.errorMsg}>⚠ {errors.category}</p>}
                    </div>

                    {/* Priority */}
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Priority</label>
                      <select
                        value={proj.priority}
                        style={inputStyle('priority')}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, 'priority')}
                        onChange={e => field('priority', e.target.value)}
                      >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      {errors.priority && <p style={styles.errorMsg}>⚠ {errors.priority}</p>}
                    </div>

                    {/* Status */}
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Status</label>
                      <select
                        value={proj.status}
                        style={inputStyle('status')}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, 'status')}
                        onChange={e => field('status', e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {errors.status && <p style={styles.errorMsg}>⚠ {errors.status}</p>}
                    </div>

                    {/* Deadline */}
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Deadline</label>
                      <input
                        type="date"
                        value={proj.deadline}
                        style={inputStyle('deadline')}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, 'deadline')}
                        onChange={e => field('deadline', e.target.value)}
                      />
                      {errors.deadline && <p style={styles.errorMsg}>⚠ {errors.deadline}</p>}
                    </div>

                    {/* Member ✅ fullName used here */}
                    <div style={styles.fieldGroup}>
                      <label style={styles.label}>Assign Member</label>
                      <select
                        value={proj.member}
                        style={inputStyle('member')}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, 'member')}
                        onChange={e => field('member', e.target.value)}
                      >
                        <option value="">Select Member</option>
                        {members.map(m => (
                          <option key={m._id} value={m._id}>
                            {m.fullName}
                          </option>
                        ))}
                      </select>
                      {errors.member && <p style={styles.errorMsg}>⚠ {errors.member}</p>}
                    </div>

                    {/* Description — full width */}
                    <div style={{ ...styles.fieldGroup, gridColumn: '1 / -1' }}>
                      <label style={styles.label}>Description</label>
                      <textarea
                        value={proj.description}
                        placeholder="Describe your project..."
                        rows={4}
                        style={{
                          ...inputStyle('description'),
                          resize: 'vertical',
                          minHeight: '110px',
                          lineHeight: '1.6',
                        }}
                        onFocus={focusIn}
                        onBlur={e => focusOut(e, 'description')}
                        onChange={e => field('description', e.target.value)}
                      />
                      {errors.description && <p style={styles.errorMsg}>⚠ {errors.description}</p>}
                    </div>

                  </div>

                  <div style={styles.divider} />

                  {/* Actions */}
                  <div style={styles.actions}>
                    <button
                      onClick={() => navigate('/projectshow')}
                      style={styles.cancelBtn}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={Update}
                      disabled={loading}
                      style={{
                        ...styles.submitBtn,
                        opacity: loading ? 0.75 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.5)'; } }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.35)'; }}
                    >
                      {loading ? 'Saving...' : '✓ Save Changes'}
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  layout:      { display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" },
  main:        { flex: 1, padding: '36px 40px', overflowY: 'auto' },
  header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
  heading:     { margin: '0 0 4px', fontSize: '28px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' },
  subheading:  { margin: 0, fontSize: '14px', color: '#64748b' },
  viewBtn:     { padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s ease' },
  statsBar:    { display: 'flex', gap: '12px', marginBottom: '32px', marginTop: '8px' },
  statChip:    { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 14px' },
  statDot:     { width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' },
  statText:    { fontSize: '13px', color: '#475569', fontWeight: '500' },
  cardWrap:    { display: 'flex', justifyContent: 'center' },
  card:        { background: '#ffffff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', width: '100%', maxWidth: '720px', overflow: 'hidden' },
  cardAccent:  { height: '4px', background: 'linear-gradient(90deg, #10b981, #059669, #06b6d4)' },
  cardBody:    { padding: '32px 36px 36px' },
  cardHeader:  { display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' },
  iconCircle:  { width: '58px', height: '58px', borderRadius: '16px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitle:   { margin: '0 0 4px', fontSize: '18px', fontWeight: '700', color: '#0f172a' },
  cardSubtitle:{ margin: 0, fontSize: '13px', color: '#64748b' },
  divider:     { height: '1px', background: '#f1f5f9', margin: '20px 0' },
  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px 0' },
  spinner:     { width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
  loadingText: { color: '#94a3b8', fontSize: '14px', margin: 0 },
  grid:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' },
  fieldGroup:  { display: 'flex', flexDirection: 'column' },
  label:       { fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '7px', letterSpacing: '0.2px' },
  input:       { padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'all 0.15s ease', background: '#f8fafc', boxSizing: 'border-box', width: '100%', fontFamily: "'Segoe UI', system-ui, sans-serif" },
  inputError:  { borderColor: '#fca5a5', background: '#fff5f5' },
  errorMsg:    { margin: '6px 0 0', fontSize: '11px', color: '#ef4444' },
  actions:     { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' },
  cancelBtn:   { padding: '11px 24px', background: 'transparent', color: '#64748b', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s ease' },
  submitBtn:   { padding: '11px 28px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.35)', transition: 'all 0.2s ease', letterSpacing: '0.2px' },
};

export default Projectupdate;
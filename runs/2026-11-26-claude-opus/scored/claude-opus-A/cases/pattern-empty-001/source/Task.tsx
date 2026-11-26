import { useState } from "react";

const styles = `
.members-page {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #1f2937;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
}
.members-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.members-header h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}
.members-table-wrap {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.members-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.members-table th {
  text-align: left;
  font-weight: 500;
  color: #6b7280;
  background: #f9fafb;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}
.members-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 56px 24px;
}
.members-empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.members-empty h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}
.members-empty p {
  margin: 0 0 24px;
  color: #6b7280;
  max-width: 380px;
  line-height: 1.5;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  cursor: pointer;
}
.btn-primary:hover { background: #4338ca; }
.btn-primary:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}
.members-status {
  margin-top: 16px;
  font-size: 13px;
  color: #059669;
}
`;

const columns = ["Name", "Email", "Role", "Status"];

export function Task() {
  const [invited, setInvited] = useState(false);

  const handleInvite = () => {
    setInvited(true);
  };

  return (
    <main className="members-page">
      <style>{styles}</style>
      <div className="members-header">
        <h1>Members</h1>
      </div>
      <div className="members-table-wrap">
        <table className="members-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length}>
                <section className="members-empty" aria-labelledby="members-empty-title">
                  <div className="members-empty-icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M19 8v6" />
                      <path d="M22 11h-6" />
                    </svg>
                  </div>
                  <h2 id="members-empty-title">No members yet</h2>
                  <p>
                    Invite teammates to collaborate. Once they accept, they'll show up here with
                    their role and status.
                  </p>
                  <button type="button" className="btn-primary" onClick={handleInvite}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                    Invite member
                  </button>
                  <div className="members-status" role="status" aria-live="polite">
                    {invited ? "Invite flow started." : ""}
                  </div>
                </section>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Task;

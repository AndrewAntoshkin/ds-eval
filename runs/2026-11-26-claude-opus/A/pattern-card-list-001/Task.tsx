import React from "react";

type MemberStatus = "Active" | "Invited" | "Suspended";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: MemberStatus;
}

const MEMBERS: TeamMember[] = [
  { id: "1", name: "Amara Okafor", role: "Engineering Manager", status: "Active" },
  { id: "2", name: "Lucas Moreau", role: "Senior Frontend Engineer", status: "Active" },
  { id: "3", name: "Priya Raman", role: "Product Designer", status: "Invited" },
  { id: "4", name: "Daniel Kim", role: "Data Analyst", status: "Suspended" },
  { id: "5", name: "Sofia Alvarez", role: "Product Manager", status: "Active" },
];

const STATUS_STYLES: Record<MemberStatus, { background: string; color: string; border: string }> = {
  Active: { background: "#e7f6ec", color: "#1a7f37", border: "#b7e4c7" },
  Invited: { background: "#eef4ff", color: "#1f5fbf", border: "#c3d7fb" },
  Suspended: { background: "#fdecec", color: "#b42318", border: "#f5c2c0" },
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

const css = `
.team-page {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #1f2328;
  background: #f6f8fa;
  min-height: 100vh;
  padding: 40px 24px;
  box-sizing: border-box;
}
.team-page * { box-sizing: border-box; }
.team-inner { max-width: 960px; margin: 0 auto; }
.team-header h1 { font-size: 24px; font-weight: 600; margin: 0 0 4px; }
.team-header p { margin: 0 0 24px; color: #59636e; font-size: 14px; }
.team-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.member-card {
  background: #fff;
  border: 1px solid #d1d9e0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  transition: box-shadow 150ms ease, border-color 150ms ease;
}
.member-card:hover { box-shadow: 0 4px 12px rgba(31, 35, 40, 0.08); border-color: #c1cbd4; }
.member-top { display: flex; align-items: center; gap: 12px; }
.member-avatar {
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #dde4ee;
  color: #3d4752;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
}
.member-info { min-width: 0; flex: 1; }
.member-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.member-role {
  margin: 2px 0 0;
  font-size: 14px;
  color: #59636e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.member-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
}
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
}
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.secondary-btn {
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #1f2328;
  background: #fff;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
}
.secondary-btn:hover { background: #f3f5f7; border-color: #c1cbd4; }
.secondary-btn:active { background: #eaeef2; }
.secondary-btn:focus-visible { outline: 2px solid #0969da; outline-offset: 2px; }
`;

function StatusTag({ status }: { status: MemberStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="status-tag"
      style={{ background: s.background, color: s.color, borderColor: s.border }}
    >
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

function MemberCard({ member, onViewProfile }: { member: TeamMember; onViewProfile: (m: TeamMember) => void }) {
  const headingId = `member-${member.id}-name`;
  return (
    <article className="member-card" aria-labelledby={headingId}>
      <div className="member-top">
        <div className="member-avatar" aria-hidden="true">
          {initials(member.name)}
        </div>
        <div className="member-info">
          <h2 id={headingId} className="member-name" title={member.name}>
            {member.name}
          </h2>
          <p className="member-role" title={member.role}>
            {member.role}
          </p>
        </div>
      </div>
      <div className="member-footer">
        <StatusTag status={member.status} />
        <button
          type="button"
          className="secondary-btn"
          onClick={() => onViewProfile(member)}
          aria-label={`View profile of ${member.name}`}
        >
          View profile
        </button>
      </div>
    </article>
  );
}

export function Task() {
  const handleViewProfile = (member: TeamMember) => {
    console.log(`View profile: ${member.name}`);
  };

  return (
    <main className="team-page">
      <style>{css}</style>
      <div className="team-inner">
        <header className="team-header">
          <h1>Team members</h1>
          <p>{MEMBERS.length} people in this workspace</p>
        </header>
        <ul className="team-list">
          {MEMBERS.map((member) => (
            <li key={member.id}>
              <MemberCard member={member} onViewProfile={handleViewProfile} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default Task;

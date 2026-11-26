import { useState } from "react";
import { Badge, Button, Card, Dialog, PageHeader, useDialog } from "@ds";

type MemberStatus = "Active" | "Invited" | "Suspended";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  status: MemberStatus;
  email: string;
};

const MEMBERS: TeamMember[] = [
  { id: "m1", name: "Ava Thompson", role: "Engineering Manager", status: "Active", email: "ava.thompson@example.com" },
  { id: "m2", name: "Noah Patel", role: "Senior Frontend Engineer", status: "Active", email: "noah.patel@example.com" },
  { id: "m3", name: "Mia Rodriguez", role: "Product Designer", status: "Invited", email: "mia.rodriguez@example.com" },
  { id: "m4", name: "Liam Chen", role: "Backend Engineer", status: "Suspended", email: "liam.chen@example.com" },
  { id: "m5", name: "Zoe Okafor", role: "QA Analyst", status: "Active", email: "zoe.okafor@example.com" },
];

const listStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const cardBodyStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--space-4)",
  flexWrap: "wrap",
};

const nameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--font-size-lg)",
  color: "var(--color-text)",
};

const metaStyle: React.CSSProperties = {
  margin: 0,
  marginTop: "var(--space-1)",
  fontSize: "var(--font-size-md)",
  color: "var(--color-text-muted)",
};

const asideStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-3)",
};

export function Task() {
  const dialog = useDialog();
  const [selected, setSelected] = useState<TeamMember | null>(null);

  const viewProfile = (member: TeamMember) => {
    setSelected(member);
    dialog.openDialog();
  };

  return (
    <div className="ds-stack">
      <PageHeader title="Team members" description="People who have access to this workspace." />

      <ul className="ds-stack" style={listStyle} aria-label="Team members">
        {MEMBERS.map((member) => (
          <li key={member.id}>
            <Card>
              <div style={cardBodyStyle}>
                <div>
                  <h2 style={nameStyle}>{member.name}</h2>
                  <p style={metaStyle}>{member.role}</p>
                </div>
                <div style={asideStyle}>
                  <Badge>{member.status}</Badge>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => viewProfile(member)}
                    aria-label={`View profile of ${member.name}`}
                  >
                    View profile
                  </Button>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Dialog open={dialog.open} title={selected ? selected.name : "Profile"} onClose={dialog.close}>
        {selected && (
          <div className="ds-stack">
            <div>
              <p style={metaStyle}>Role</p>
              <p style={{ margin: 0, color: "var(--color-text)" }}>{selected.role}</p>
            </div>
            <div>
              <p style={metaStyle}>Email</p>
              <p style={{ margin: 0, color: "var(--color-text)" }}>{selected.email}</p>
            </div>
            <div>
              <p style={metaStyle}>Status</p>
              <Badge>{selected.status}</Badge>
            </div>
            <div className="ds-row">
              <Button type="button" variant="secondary" onClick={dialog.close}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

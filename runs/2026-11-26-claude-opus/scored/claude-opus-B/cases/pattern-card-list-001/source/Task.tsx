import { Badge, Button, Card, PageHeader } from "@ds";

type MemberStatus = "Active" | "Invited" | "Suspended";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: MemberStatus;
}

const members: TeamMember[] = [
  { id: "1", name: "Ava Thompson", role: "Engineering Manager", status: "Active" },
  { id: "2", name: "Liam Chen", role: "Senior Frontend Engineer", status: "Active" },
  { id: "3", name: "Sofia Martinez", role: "Product Designer", status: "Invited" },
  { id: "4", name: "Noah Patel", role: "Backend Engineer", status: "Suspended" },
  { id: "5", name: "Mia Johansson", role: "QA Analyst", status: "Invited" },
];

export function Task() {
  const handleViewProfile = (member: TeamMember) => {
    console.log(`View profile: ${member.name}`);
  };

  return (
    <main
      style={{
        padding: "var(--space-6)",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
        minHeight: "100vh",
      }}
    >
      <div className="ds-stack">
        <PageHeader
          title="Team members"
          description="People who have access to this workspace."
        />

        <ul
          className="ds-stack"
          aria-label="Team members"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {members.map((member) => (
            <li key={member.id}>
              <Card>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "var(--space-4)",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          fontSize: "var(--font-size-lg)",
                          color: "var(--color-text)",
                        }}
                      >
                        {member.name}
                      </h2>
                      <Badge>{member.status}</Badge>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "var(--font-size-sm)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {member.role}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleViewProfile(member)}
                    aria-label={`View profile of ${member.name}`}
                  >
                    View profile
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default Task;

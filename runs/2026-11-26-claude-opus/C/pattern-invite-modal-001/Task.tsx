import { useId, useState, type FormEvent } from "react";
import {
  Badge,
  Button,
  Card,
  Dialog,
  HelperText,
  Input,
  Label,
  PageHeader,
  Select,
  useDialog,
} from "@ds";

type Role = "Admin" | "Editor" | "Viewer";

interface Invite {
  email: string;
  role: Role;
}

const ROLES: Role[] = ["Admin", "Editor", "Viewer"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Task() {
  const { open, openDialog, close } = useDialog();
  const emailId = useId();
  const emailHelpId = `${emailId}-help`;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Viewer");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [invites, setInvites] = useState<Invite[]>([]);

  const resetForm = () => {
    setEmail("");
    setRole("Viewer");
    setEmailError(undefined);
  };

  const handleOpen = () => {
    resetForm();
    openDialog();
  };

  const handleClose = () => {
    resetForm();
    close();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Enter an email address.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError("Enter a valid email address, like name@company.com.");
      return;
    }
    setInvites((current) => [...current, { email: trimmed, role }]);
    handleClose();
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Team members"
        description="Invite people to collaborate and choose what they can access."
        actions={<Button onClick={handleOpen}>Invite member</Button>}
      />

      <Card>
        <div className="ds-stack">
          {invites.length === 0 ? (
            <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
              No pending invites yet.
            </p>
          ) : (
            invites.map((invite) => (
              <div
                key={`${invite.email}-${invite.role}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "var(--space-3)",
                }}
              >
                <span>{invite.email}</span>
                <Badge>{invite.role} · Pending</Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      <Dialog open={open} title="Invite member" onClose={handleClose}>
        <form className="ds-stack" onSubmit={handleSubmit} noValidate>
          <div className="ds-field">
            <Label htmlFor={emailId}>Email</Label>
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              invalid={Boolean(emailError)}
              aria-describedby={emailHelpId}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError(undefined);
              }}
              autoFocus
            />
            <span id={emailHelpId}>
              {emailError ? (
                <HelperText error>{emailError}</HelperText>
              ) : (
                <HelperText>We'll send an invitation link to this address.</HelperText>
              )}
            </span>
          </div>

          <Select
            label="Role"
            helper="You can change this later."
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>

          <div className="ds-row">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Send invite</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Card,
  Dialog,
  HelperText,
  Input,
  Label,
  PageHeader,
  Select,
} from "@ds";

type Role = "admin" | "editor" | "viewer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Task() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [submitted, setSubmitted] = useState(false);
  const [lastInvite, setLastInvite] = useState<string | null>(null);

  const emailError =
    email.trim() === ""
      ? "Email is required."
      : !EMAIL_PATTERN.test(email.trim())
        ? "Enter a valid email address."
        : null;
  const showEmailError = submitted && emailError !== null;

  const reset = () => {
    setEmail("");
    setRole("viewer");
    setSubmitted(false);
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const sendInvite = (event?: FormEvent) => {
    event?.preventDefault();
    setSubmitted(true);
    if (emailError) return;
    setLastInvite(`Invite sent to ${email.trim()} as ${role}.`);
    close();
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Members"
        description="Manage who has access to this workspace."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            Invite member
          </Button>
        }
      />

      {lastInvite && (
        <Card>
          <HelperText>{lastInvite}</HelperText>
        </Card>
      )}

      <Dialog
        open={open}
        onClose={close}
        title="Invite member"
        footer={
          <div className="ds-row">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => sendInvite()}>
              Send invite
            </Button>
          </div>
        }
      >
        <form className="ds-stack" onSubmit={sendInvite} noValidate>
          <div className="ds-stack" style={{ gap: "var(--space-1)" }}>
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              invalid={showEmailError}
              aria-invalid={showEmailError}
              aria-describedby="invite-email-help"
              autoFocus
            />
            <HelperText id="invite-email-help" error={showEmailError}>
              {showEmailError
                ? emailError
                : "We'll email them a link to join this workspace."}
            </HelperText>
          </div>

          <Select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            helperText="Admins can manage members and settings."
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </Select>
        </form>
      </Dialog>
    </div>
  );
}

export default Task;

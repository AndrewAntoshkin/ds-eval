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
  useDialog,
} from "@ds";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Task() {
  const invite = useDialog();
  const emailId = useId();
  const helpId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string[]>([]);

  const closeInvite = () => {
    setEmail("");
    setError(null);
    invite.close();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError("Enter a valid email address, like name@company.com.");
      return;
    }
    setPending((current) => [...current, value]);
    closeInvite();
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Members"
        description="People who can access this workspace."
      />

      <Card>
        <div
          className="ds-stack"
          style={{
            justifyItems: "center",
            textAlign: "center",
            paddingBlock: "var(--space-6)",
            paddingInline: "var(--space-5)",
          }}
        >
          <Badge>0 members</Badge>
          <h2
            style={{
              margin: 0,
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text)",
            }}
          >
            No members yet
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: "48ch",
              fontSize: "var(--font-size-md)",
              color: "var(--color-text-muted)",
            }}
          >
            Invite teammates to collaborate in this workspace. They'll appear
            in this table once they accept their invitation.
          </p>
          <Button type="button" variant="primary" onClick={invite.openDialog}>
            Invite member
          </Button>
          {pending.length > 0 && (
            <p
              role="status"
              style={{
                margin: 0,
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              {pending.length === 1
                ? `Invitation sent to ${pending[0]}.`
                : `${pending.length} invitations pending.`}
            </p>
          )}
        </div>
      </Card>

      <Dialog open={invite.open} title="Invite a member" onClose={closeInvite}>
        <form className="ds-stack" onSubmit={handleSubmit} noValidate>
          <div className="ds-field">
            <Label htmlFor={emailId}>Email address</Label>
            <Input
              id={emailId}
              type="email"
              autoComplete="email"
              value={email}
              invalid={Boolean(error)}
              aria-describedby={helpId}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError(null);
              }}
            />
            <HelperText error={Boolean(error)}>
              <span id={helpId}>
                {error ?? "We'll email them a link to join this workspace."}
              </span>
            </HelperText>
          </div>
          <div className="ds-row">
            <Button type="button" variant="secondary" onClick={closeInvite}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send invite
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

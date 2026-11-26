import { useState, type FormEvent } from "react";
import {
  Button,
  Card,
  HelperText,
  Input,
  Label,
  PageHeader,
  Select,
  Textarea,
} from "@ds";

const MAX_MESSAGE_LENGTH = 500;
const CATEGORIES = ["Bug", "Idea", "Question"] as const;

export function Task() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const subjectError = submitted && subject.trim() === "" ? "Enter a subject." : undefined;
  const messageError = submitted && message.trim() === "" ? "Enter a message." : undefined;

  const reset = () => {
    setSubject("");
    setCategory(CATEGORIES[0]);
    setMessage("");
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setSent(false);
    if (subject.trim() === "" || message.trim() === "") return;
    setSent(true);
    reset();
  };

  return (
    <div className="ds-stack">
      <PageHeader title="Send feedback" description="Tell us about a bug, share an idea, or ask a question." />
      <Card>
        <form className="ds-stack" onSubmit={handleSubmit} noValidate>
          <div className="ds-field">
            <Label htmlFor="feedback-subject">Subject</Label>
            <Input
              id="feedback-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              invalid={Boolean(subjectError)}
              aria-describedby={subjectError ? "feedback-subject-error" : undefined}
              required
            />
            {subjectError && (
              <HelperText error>
                <span id="feedback-subject-error">{subjectError}</span>
              </HelperText>
            )}
          </div>

          <Select
            id="feedback-category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <div className="ds-field">
            <Label htmlFor="feedback-message">Message</Label>
            <Textarea
              id="feedback-message"
              rows={6}
              maxLength={MAX_MESSAGE_LENGTH}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              invalid={Boolean(messageError)}
              aria-describedby="feedback-message-help"
              required
            />
            <HelperText error={Boolean(messageError)}>
              <span id="feedback-message-help">
                {messageError ??
                  `Limited to ${MAX_MESSAGE_LENGTH} characters (${message.length}/${MAX_MESSAGE_LENGTH}).`}
              </span>
            </HelperText>
          </div>

          {sent && <HelperText>Thanks! Your feedback has been sent.</HelperText>}

          <div className="ds-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                setSent(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send feedback
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

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

type Category = "bug" | "idea" | "question";

export function Task() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Category>("bug");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subjectInvalid = submitted && subject.trim() === "";
  const messageInvalid = submitted && message.trim() === "";

  const reset = () => {
    setSubject("");
    setCategory("bug");
    setMessage("");
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (subject.trim() === "" || message.trim() === "") return;
    reset();
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Send feedback"
        description="Tell us about a bug, share an idea, or ask a question."
      />
      <Card>
        <form className="ds-stack" onSubmit={handleSubmit} noValidate>
          <div>
            <Label htmlFor="feedback-subject">Subject</Label>
            <Input
              id="feedback-subject"
              name="subject"
              value={subject}
              invalid={subjectInvalid}
              aria-invalid={subjectInvalid}
              aria-describedby={subjectInvalid ? "feedback-subject-error" : undefined}
              onChange={(e) => setSubject(e.target.value)}
            />
            {subjectInvalid && (
              <HelperText id="feedback-subject-error" error>
                Enter a subject.
              </HelperText>
            )}
          </div>

          <Select
            id="feedback-category"
            name="category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="bug">Bug</option>
            <option value="idea">Idea</option>
            <option value="question">Question</option>
          </Select>

          <div>
            <Label htmlFor="feedback-message">Message</Label>
            <Textarea
              id="feedback-message"
              name="message"
              value={message}
              maxLength={MAX_MESSAGE_LENGTH}
              invalid={messageInvalid}
              aria-invalid={messageInvalid}
              aria-describedby="feedback-message-helper"
              onChange={(e) => setMessage(e.target.value)}
            />
            <HelperText id="feedback-message-helper" error={messageInvalid}>
              {messageInvalid
                ? "Enter a message. Limited to 500 characters."
                : `Limited to 500 characters (${message.length}/${MAX_MESSAGE_LENGTH}).`}
            </HelperText>
          </div>

          <div className="ds-row">
            <Button type="button" variant="secondary" onClick={reset}>
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

export default Task;

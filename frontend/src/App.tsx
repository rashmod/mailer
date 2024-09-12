import { FormEvent } from "react";
import { Button } from "./components/ui/button";
import axios from "axios";

export default function App() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const to = event.currentTarget.to.value;
    const subject = event.currentTarget.subject.value;
    const text = event.currentTarget.text.value;

    const response = await axios.post(import.meta.env.VITE_BACKEND_URL, {
      to,
      subject,
      text,
    });

    const data = await response.data;

    console.log(data);
  }

  return (
    <main className="container min-h-screen p-24">
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="to">Receiver Email</label>
          <input type="text" name="to" id="to" />
        </div>

        <div>
          <label htmlFor="subject">Subject</label>
          <input type="text" name="subject" id="subject" />
        </div>

        <div>
          <label htmlFor="text">Message</label>
          <input type="text" name="text" id="text" />
        </div>

        <Button>Submit</Button>
      </form>
    </main>
  );
}

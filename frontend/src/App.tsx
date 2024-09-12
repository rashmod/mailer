import { Button } from "./components/ui/button";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

type EmailFormValues = {
  to: string;
  subject: string;
  text: string;
};

export default function App() {
  const { register, handleSubmit, reset } = useForm<EmailFormValues>();

  const mutation = useMutation({
    mutationFn: (emailData: EmailFormValues) => {
      return axios.post(import.meta.env.VITE_BACKEND_URL, emailData);
    },
  });

  const onSubmit = (data: EmailFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        alert("Email sent successfully!");
        reset();
      },
      onError: (error: any) => {
        console.error("Error sending email:", error);
        alert("Failed to send email");
      },
    });
  };

  return (
    <main className="container min-h-screen p-24">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="receiver">Receiver's Email:</label>
          <input
            id="receiver"
            {...register("to", { required: true })}
            placeholder="example@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject">Subject:</label>
          <input
            id="subject"
            {...register("subject", { required: true })}
            placeholder="Subject"
          />
        </div>

        <div>
          <label htmlFor="text">Message Body:</label>
          <textarea
            id="text"
            {...register("text", { required: true })}
            placeholder="Your message..."
          />
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send Email"}
        </Button>

        {mutation.isError && (
          <p style={{ color: "red" }}>Error sending email</p>
        )}
      </form>
    </main>
  );
}

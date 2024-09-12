import { Button } from "./components/ui/button";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./components/ui/textarea";

const formSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(100),
  text: z.string().min(1).max(1000),
});

type formValues = z.infer<typeof formSchema>;

export default function App() {
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "",
      subject: "",
      text: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (emailData: formValues) => {
      return axios.post(import.meta.env.VITE_BACKEND_URL, emailData);
    },
  });

  const onSubmit = (data: formValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        alert("Email sent successfully!");
        form.reset();
      },
      onError: (error: any) => {
        console.error("Error sending email:", error);
        alert("Failed to send email");
      },
    });
  };

  return (
    <main className="container min-h-screen p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver's Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Application" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message Body</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending..." : "Send Email"}
          </Button>

          {mutation.isError && (
            <p style={{ color: "red" }}>Error sending email</p>
          )}
        </form>
      </Form>
    </main>
  );
}

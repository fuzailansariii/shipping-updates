"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input-form";
import { MessageData, messageSchema } from "@/lib/validations/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
  } = useForm<MessageData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      subject: undefined, // Don't set a default, force user to select
      email: "",
      message: "",
      name: "",
    },
  });

  const onSubmit = async (data: MessageData) => {
    //TODO: Have to add rate limiting on server side later
    try {
      const response = await axios.post("/api/messages", data, {
        timeout: 10000,
      });
      if (response.status === 201) {
        toast.success("Message sent!", {
          description:
            "Thanks for contacting us. We will get back to you soon.",
          classNames: {
            description: "!text-gray-700",
          },
        });
      }
      reset(); // Reset form after successful submission
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      if (err.response) {
        toast.error(err.response.data?.error ?? "Something went wrong");
      } else {
        toast.error("Network error. Please try again.");
      }
      console.error("Error submitting the form:", err);
    }
  };

  return (
    <Container>
      <div className="flex flex-col gap-6 md:gap-10 justify-center items-center px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center font-nunito max-w-2xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
            Contact Shipping Updates
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Have a question? We're here to help.
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 px-4 md:px-0"
        >
          {/* Email Input */}
          <div className="w-full">
            <Input
              register={register("email")}
              placeholder="Enter your email here"
              label="Email"
              error={errors.email}
              as="input"
              type="email"
              name="email-input"
              className="w-full"
            />
          </div>

          {/* Name Input */}
          <div className="w-full">
            <Input
              register={register("name")}
              placeholder="Enter your name here"
              label="Name"
              error={errors.name}
              as="input"
              type="text"
              name="name-input"
              className="w-full"
            />
          </div>

          {/* Subject Dropdown - Full Width */}
          <div className="w-full md:col-span-2">
            <Input
              register={register("subject")}
              label="Subject"
              error={errors.subject}
              as="select"
              name="subject-select"
              className="w-full"
            >
              <option value="">-- Select a subject --</option>
              <option value="general_inquiry">General Inquiry</option>
              <option value="study_materials">Study Materials</option>
              <option value="payment_issue">Payment Issue</option>
              <option value="access_problem">Access Problem</option>
              <option value="exam_guidance">Exam Guidance</option>
            </Input>
          </div>

          {/* Message Textarea - Full Width */}
          <div className="w-full md:col-span-2">
            <Input
              register={register("message")}
              placeholder="Type your message here..."
              label="Message"
              error={errors.message}
              as="textarea"
              name="message-textarea"
              className="w-full min-h-37.5 md:min-h-50"
            />
          </div>

          {/* Submit Button - Full Width */}
          <div className="w-full md:col-span-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={"default"}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>

        {/* Additional Contact Info (Optional) */}
        <div className="w-full max-w-2xl mt-8 px-4 md:px-0">
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 border">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Other Ways to Reach Us
            </h2>
            <div className="space-y-3 text-sm font-lato md:text-base">
              <p className="text-gray-600">
                <strong>Email:</strong>{" "}
                <Link
                  href="mailto:shippingupdates21@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  shippingupdates21@gmail.com
                </Link>
              </p>
              <p className="text-gray-600">
                <strong>Response Time:</strong> Within 24-48 hours
              </p>
              <p className="text-gray-600">
                <strong>YouTube:</strong>{" "}
                <Link
                  href="https://www.youtube.com/@ShippingUpdates"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  Shipping Updates Channel
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

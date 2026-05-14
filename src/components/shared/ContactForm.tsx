import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, RefreshCw } from "lucide-react";
import {
  generateMathChallenge,
  type MathChallenge,
  validateMathAnswer,
} from "@/utils/mathCaptcha";
import { publicEnv } from "@/utils/env";

const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type ContactFormProps = {
  onSuccess?: () => void;
};

type ContactApiResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const [mathChallenge, setMathChallenge] = useState<MathChallenge>(() =>
    generateMathChallenge(),
  );
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathError, setMathError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const successTimeoutRef = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  const contactEndpoint = publicEnv.contactEndpoint;

  const refreshMathChallenge = () => {
    setMathChallenge(generateMathChallenge());
    setMathAnswer("");
    setMathError("");
  };

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setSubmitError("");
    setSubmitSuccess("");

    const validation = validateMathAnswer(mathAnswer, mathChallenge);
    if (!validation.valid) {
      setMathError(validation.error ?? "Invalid answer");
      if (validation.error === "Incorrect answer") {
        setMathChallenge(generateMathChallenge());
        setMathAnswer("");
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("message", data.message ?? "");

      const res = await fetch(contactEndpoint, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch((): null => null);
      const parsed: ContactApiResponse | null =
        json && typeof json === "object" ? (json as ContactApiResponse) : null;
      const serverMessage =
        (parsed && (parsed.error || parsed.message)) || null;

      if (!res.ok || parsed?.ok === false) {
        setSubmitError(
          serverMessage ||
            "Unable to send your message. Please try again later.",
        );
        return;
      }

      setSubmitSuccess(
        serverMessage || "Thanks! Your message was sent successfully.",
      );

      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = window.setTimeout(() => {
        reset();
        setMathChallenge(generateMathChallenge());
        setMathAnswer("");
        setMathError("");
        setSubmitError("");
        setSubmitSuccess("");
        successTimeoutRef.current = null;

        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        "Network error. Please check your connection and try again.",
      );
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#111318] border border-[#23272F] rounded-2xl p-8 sm:p-10">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[30px] font-bold text-[#E7EBEF] text-center mb-2 leading-[1.2]">
          Contact Us
        </h2>
        <p className="text-base text-[#7E8A9A] text-center leading-normal">
          See how Zeustra can transform your commercial real estate workflow
        </p>
      </div>

      {submitSuccess ? (
        <div
          className="flex items-center justify-center min-h-90"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-110 rounded-[20px] border border-[#4DB5FF]/35 bg-[#0B1622] px-6 py-10 text-center shadow-[0_0_30px_rgba(77,181,255,0.12)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#4DB5FF]/40 bg-[#102235]">
              <svg
                className="h-7 w-7 text-[#4DB5FF]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="mt-5 text-[26px] font-bold leading-tight text-[#E7EBEF]">
              Message sent
            </p>
            <p className="mt-3 text-sm leading-6 text-[#9CCEF8]">
              {submitSuccess}
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          noValidate
        >
          <div>
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-[#E7EBEF]"
            >
              Full Name
            </label>
            <input
              {...register("fullName")}
              type="text"
              id="fullName"
              aria-required="true"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={`w-full h-10 px-4 bg-[#080A0C] border rounded-[10px] text-sm text-white placeholder-[#7E8A9A] focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 focus:border-[#4DB5FF]/50 transition-all ${
                errors.fullName ? "border-red-500/50" : "border-[#23272F]"
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p
                id="fullName-error"
                className="mt-2 text-sm text-red-400"
                role="alert"
              >
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-[#E7EBEF]"
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full h-10 px-4 bg-[#080A0C] border rounded-[10px] text-sm text-white placeholder-[#7E8A9A] focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 focus:border-[#4DB5FF]/50 transition-all ${
                errors.email ? "border-red-500/50" : "border-[#23272F]"
              }`}
              placeholder="john@company.com"
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-2 text-sm text-red-400"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-[#E7EBEF]"
            >
              Message <span className="text-[#7E8A9A]">(optional)</span>
            </label>
            <textarea
              {...register("message")}
              id="message"
              rows={4}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full min-h-24.5 px-4 py-3 bg-[#080A0C] border rounded-[10px] text-sm text-white placeholder-[#7E8A9A] focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 focus:border-[#4DB5FF]/50 transition-all resize-none ${
                errors.message ? "border-red-500/50" : "border-[#23272F]"
              }`}
              placeholder="Your message here..."
            />
            {errors.message && (
              <p
                id="message-error"
                className="mt-2 text-sm text-red-400"
                role="alert"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="mathAnswer"
              className="block mb-2 text-sm font-medium text-[#E7EBEF]"
            >
              Verify you are human
            </label>
            <p className="mb-2 text-sm text-[#7E8A9A]" aria-live="polite">
              {mathChallenge.question}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <input
                type="text"
                id="mathAnswer"
                value={mathAnswer}
                onChange={(e) => {
                  setMathAnswer(e.target.value.replace(/[^0-9]/g, ""));
                  if (mathError) setMathError("");
                }}
                inputMode="numeric"
                autoComplete="off"
                aria-required="true"
                aria-invalid={!!mathError}
                aria-describedby={mathError ? "mathAnswer-error" : undefined}
                placeholder="Answer"
                className={`w-full sm:flex-1 h-10 px-4 bg-[#080A0C] border rounded-[10px] text-sm text-white placeholder-[#7E8A9A] focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 focus:border-[#4DB5FF]/50 transition-all ${
                  mathError ? "border-red-500/50" : "border-[#23272F]"
                }`}
              />
              <button
                type="button"
                onClick={refreshMathChallenge}
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#E7EBEF] border border-[#23272F] bg-[#080A0C] hover:border-[#4DB5FF]/50 hover:bg-[#111318] hover:text-[#4DB5FF] transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30"
                aria-label="Get a new math problem"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            {mathError && (
              <p
                id="mathAnswer-error"
                className="mt-2 text-sm text-red-400"
                role="alert"
              >
                {mathError}
              </p>
            )}
          </div>

          {submitError && (
            <p className="text-sm text-red-400" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full h-12.5 px-6 rounded-[10px] bg-linear-to-b from-[#4DB5FF] to-[#4B93E0] text-[#0A0A0A] font-semibold text-base hover:shadow-[0_0_25px_rgba(77,181,255,0.7)] transition-all duration-300 border-[1.25px] border-[#4DB5FF] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send contact form"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2 text-[#0A0A0A]">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Sending...</span>
              </span>
            ) : (
              <span className="text-[#0A0A0A]">Send</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;

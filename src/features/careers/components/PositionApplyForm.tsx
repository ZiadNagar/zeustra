import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Upload } from "lucide-react";

const MAX_PHONE_LENGTH = 20;
const MAX_EXPERIENCE_LENGTH = 1000;
const MAX_WHY_ZEUSTRA_LENGTH = 1000;
const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const applicationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(100, "Last name must be less than 100 characters"),
  email: z.email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(6, "Phone number must be at least 6 characters")
    .max(
      MAX_PHONE_LENGTH,
      `Phone number must be ${MAX_PHONE_LENGTH} characters or less`,
    ),
  linkedin: z.string().max(255, "LinkedIn URL is too long").optional(),
  experience: z
    .string()
    .min(20, "Please provide at least 20 characters about your experience")
    .max(
      MAX_EXPERIENCE_LENGTH,
      `Experience must be ${MAX_EXPERIENCE_LENGTH} characters or less`,
    ),
  whyZeustra: z
    .string()
    .max(
      MAX_WHY_ZEUSTRA_LENGTH,
      `Answer must be ${MAX_WHY_ZEUSTRA_LENGTH} characters or less`,
    )
    .optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

type ApplicationApiError = {
  error?: {
    status?: number;
    name?: string;
    message?: string;
    details?: {
      errors?: Array<{ path?: string[]; message?: string }>;
    };
  };
};

type MappedFormField = keyof ApplicationFormValues;
type ResolvedApiPath = MappedFormField | "cv" | null;

const PATH_SEGMENT_TO_FIELD: Record<string, MappedFormField> = {
  firstname: "firstName",
  first_name: "firstName",
  lastname: "lastName",
  last_name: "lastName",
  email: "email",
  phonenumber: "phoneNumber",
  phone_number: "phoneNumber",
  linkedin: "linkedin",
  experience: "experience",
  whyzeustra: "whyZeustra",
  why_zeustra: "whyZeustra",
};

function resolveApiErrorPath(path?: string[]): ResolvedApiPath {
  if (!path?.length) {
    return null;
  }

  const lower = path.map((p) => p.toLowerCase());
  if (
    lower.some(
      (segment) =>
        segment === "cv" ||
        segment === "files.cv" ||
        segment.split(".").includes("cv"),
    )
  ) {
    return "cv";
  }

  const tail = lower[lower.length - 1];
  if (tail in PATH_SEGMENT_TO_FIELD) {
    return PATH_SEGMENT_TO_FIELD[tail];
  }

  return null;
}

function collectApiErrorDisplay(
  status: number,
  parsed: ApplicationApiError | null,
): {
  fieldErrors: Partial<Record<MappedFormField, string>>;
  cvError: string;
  generalBanner: string;
} {
  const statusFallback =
    status === 403
      ? "Too many applications from this IP address. Please try again in an hour."
      : status >= 500
        ? "Application service is temporarily unavailable. Please try again."
        : "Unable to submit your application right now. Please try again.";

  const fieldErrors: Partial<Record<MappedFormField, string>> = {};
  let cvError = "";
  const unmapped: string[] = [];

  const err = parsed?.error;
  const details = err?.details?.errors ?? [];

  for (const item of details) {
    const msg = item.message?.trim();
    if (!msg) {
      continue;
    }
    const mapped = resolveApiErrorPath(item.path);
    if (mapped === "cv") {
      cvError = msg;
    } else if (mapped) {
      fieldErrors[mapped] = msg;
    } else {
      unmapped.push(msg);
    }
  }

  const topMessage = err?.message?.trim() ?? "";

  let generalBanner = "";

  if (unmapped.length > 0) {
    generalBanner = unmapped.join(" · ");
  } else if (details.length === 0) {
    generalBanner = topMessage || statusFallback;
  } else {
    const inlineMessages = new Set<string>(
      [...Object.values(fieldErrors), cvError].filter(Boolean),
    );
    if (topMessage && !inlineMessages.has(topMessage)) {
      generalBanner = topMessage;
    }
  }

  const hasInline = cvError !== "" || Object.keys(fieldErrors).length > 0;

  if (!generalBanner && !hasInline) {
    generalBanner = topMessage || statusFallback;
  }

  return { fieldErrors, cvError, generalBanner };
}

type PositionApplyFormProps = {
  applicationEndpoint: string;
  positionId: string;
  positionTitle: string;
  onSuccess?: () => void;
};

const PositionApplyForm = ({
  applicationEndpoint,
  positionId,
  positionTitle,
  onSuccess,
}: PositionApplyFormProps) => {
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      linkedin: "",
      experience: "",
      whyZeustra: "",
    },
  });

  const onResumeChange = (fileList: FileList | null) => {
    const file = fileList?.[0] ?? null;
    setResumeFile(file);
    setResumeError("");

    if (!file) {
      return;
    }

    if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
      setResumeFile(null);
      setResumeError("Upload a PDF, DOC, or DOCX file.");
    }
  };

  const onSubmit: SubmitHandler<ApplicationFormValues> = async (values) => {
    clearErrors();
    setSubmitError("");
    setSubmitSuccess("");
    setResumeError("");

    if (!resumeFile) {
      setResumeError("Please upload your CV.");
      return;
    }

    if (!ACCEPTED_RESUME_TYPES.includes(resumeFile.type)) {
      setResumeError("Unsupported file format. Use PDF, DOC, or DOCX.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName.trim());
      formData.append("lastName", values.lastName.trim());
      formData.append("email", values.email.trim());
      formData.append("phoneNumber", values.phoneNumber.trim());
      formData.append("experience", values.experience.trim());
      formData.append("position", positionId);
      formData.append("cv", resumeFile);

      if (values.linkedin?.trim()) {
        formData.append("linkedin", values.linkedin.trim());
      }

      if (values.whyZeustra?.trim()) {
        formData.append("whyZeustra", values.whyZeustra.trim());
      }

      const response = await fetch(applicationEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const responseText = await response.text();
        let parsed: ApplicationApiError | null = null;
        if (responseText) {
          parsed = (() => {
            try {
              return JSON.parse(responseText) as ApplicationApiError;
            } catch {
              return null;
            }
          })();
        }

        const { fieldErrors, cvError, generalBanner } = collectApiErrorDisplay(
          response.status,
          parsed,
        );

        for (const key of Object.keys(fieldErrors) as MappedFormField[]) {
          const message = fieldErrors[key];
          if (message) {
            setError(key, { type: "server", message });
          }
        }

        if (cvError) {
          setResumeError(cvError);
        }

        setSubmitError(generalBanner);
        return;
      }

      setSubmitSuccess(
        "Application submitted successfully. Our team will review it and get back to you soon.",
      );
      setResumeFile(null);
      setResumeError("");
      reset();
      window.setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 900);
    } catch (error) {
      console.error("Career application submission failed", error);
      setSubmitError(
        "Network error. Please check your connection and try again.",
      );
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#23272F] bg-[#111318] p-6 sm:p-8">
      <div className="mb-6 border-b border-[#23272F] pb-4">
        <h3 className="text-heading-3 text-[#E7EBEF]">Apply for this role</h3>
        <p className="mt-2 text-body-sm text-[#7E8A9A]">
          You are applying for{" "}
          <span className="text-[#E7EBEF]">{positionTitle}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-[#E7EBEF]"
            >
              First Name
            </label>
            <input
              {...register("firstName")}
              id="firstName"
              type="text"
              aria-invalid={Boolean(errors.firstName)}
              className={`h-10 w-full rounded-[10px] border bg-[#080A0C] px-4 text-sm text-white placeholder-[#7E8A9A] transition-all focus:border-[#4DB5FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 ${
                errors.firstName ? "border-red-500/50" : "border-[#23272F]"
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-400">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-[#E7EBEF]"
            >
              Last Name
            </label>
            <input
              {...register("lastName")}
              id="lastName"
              type="text"
              aria-invalid={Boolean(errors.lastName)}
              className={`h-10 w-full rounded-[10px] border bg-[#080A0C] px-4 text-sm text-white placeholder-[#7E8A9A] transition-all focus:border-[#4DB5FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 ${
                errors.lastName ? "border-red-500/50" : "border-[#23272F]"
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-400">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#E7EBEF]"
            >
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              aria-invalid={Boolean(errors.email)}
              className={`h-10 w-full rounded-[10px] border bg-[#080A0C] px-4 text-sm text-white placeholder-[#7E8A9A] transition-all focus:border-[#4DB5FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 ${
                errors.email ? "border-red-500/50" : "border-[#23272F]"
              }`}
              placeholder="john@company.com"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-2 block text-sm font-medium text-[#E7EBEF]"
            >
              Phone Number
            </label>
            <input
              {...register("phoneNumber")}
              id="phoneNumber"
              type="text"
              aria-invalid={Boolean(errors.phoneNumber)}
              className={`h-10 w-full rounded-[10px] border bg-[#080A0C] px-4 text-sm text-white placeholder-[#7E8A9A] transition-all focus:border-[#4DB5FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 ${
                errors.phoneNumber ? "border-red-500/50" : "border-[#23272F]"
              }`}
              placeholder="+1 555-0100"
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-400">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="linkedin"
            className="mb-2 block text-sm font-medium text-[#E7EBEF]"
          >
            LinkedIn <span className="text-[#7E8A9A]">(optional)</span>
          </label>
          <input
            {...register("linkedin")}
            id="linkedin"
            type="text"
            aria-invalid={Boolean(errors.linkedin)}
            className={`h-10 w-full rounded-[10px] border bg-[#080A0C] px-4 text-sm text-white placeholder-[#7E8A9A] transition-all focus:border-[#4DB5FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 ${
              errors.linkedin ? "border-red-500/50" : "border-[#23272F]"
            }`}
            placeholder="https://linkedin.com/in/username"
          />
          {errors.linkedin && (
            <p className="mt-2 text-sm text-red-400">
              {errors.linkedin.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="experience"
            className="mb-2 block text-sm font-medium text-[#E7EBEF]"
          >
            Experience
          </label>
          <textarea
            {...register("experience")}
            id="experience"
            rows={4}
            aria-invalid={Boolean(errors.experience)}
            className={`min-h-24.5 w-full resize-none rounded-[10px] border bg-[#080A0C] px-4 py-3 text-sm text-white placeholder-[#7E8A9A] transition-all focus:border-[#4DB5FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 ${
              errors.experience ? "border-red-500/50" : "border-[#23272F]"
            }`}
            placeholder="Tell us about your relevant experience..."
          />
          {errors.experience && (
            <p className="mt-2 text-sm text-red-400">
              {errors.experience.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="whyZeustra"
            className="mb-2 block text-sm font-medium text-[#E7EBEF]"
          >
            Why Zeustra? <span className="text-[#7E8A9A]">(optional)</span>
          </label>
          <textarea
            {...register("whyZeustra")}
            id="whyZeustra"
            rows={3}
            aria-invalid={Boolean(errors.whyZeustra)}
            className={`min-h-20 w-full resize-none rounded-[10px] border bg-[#080A0C] px-4 py-3 text-sm text-white placeholder-[#7E8A9A] transition-all focus:border-[#4DB5FF]/50 focus:outline-none focus:ring-2 focus:ring-[#4DB5FF]/30 ${
              errors.whyZeustra ? "border-red-500/50" : "border-[#23272F]"
            }`}
            placeholder="What excites you about this position?"
          />
          {errors.whyZeustra && (
            <p className="mt-2 text-sm text-red-400">
              {errors.whyZeustra.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cv"
            className="mb-2 block text-sm font-medium text-[#E7EBEF]"
          >
            Upload CV (PDF, DOC, DOCX)
          </label>
          <label
            htmlFor="cv"
            className={`flex cursor-pointer items-center gap-3 rounded-[10px] border bg-[#080A0C] px-4 py-3 text-sm transition-all ${
              resumeError ? "border-red-500/50" : "border-[#23272F]"
            } hover:border-[#4DB5FF]/50`}
          >
            <Upload className="h-4 w-4 text-[#4DB5FF]" aria-hidden="true" />
            <span className="truncate text-[#E7EBEF]">
              {resumeFile ? resumeFile.name : "Choose a file"}
            </span>
          </label>
          <input
            id="cv"
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx"
            onChange={(event) => onResumeChange(event.target.files)}
          />
          {resumeError && (
            <p
              className="mt-2 text-sm text-red-400"
              role="alert"
              aria-live="polite"
            >
              {resumeError}
            </p>
          )}
        </div>

        {submitError && (
          <p
            className="text-sm text-red-400"
            role="alert"
            aria-live="polite"
          >
            {submitError}
          </p>
        )}
        {submitSuccess && (
          <p
            className="text-sm text-green-400"
            role="status"
            aria-live="polite"
          >
            {submitSuccess}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative h-12.5 w-full rounded-[10px] border-[1.25px] border-[#4DB5FF] bg-linear-to-b from-[#4DB5FF] to-[#4B93E0] px-6 text-base font-semibold text-[#0A0A0A] transition-all duration-300 hover:shadow-[0_0_25px_rgba(77,181,255,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2 text-[#0A0A0A]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Submitting...</span>
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
};

export default PositionApplyForm;

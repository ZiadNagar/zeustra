import type { ComponentProps } from "react";

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

type BlogSubscribeCardProps = {
  email: string;
  didSubscribe: boolean;
  onEmailChange: (value: string) => void;
  onSubscribe: FormSubmitHandler;
};

export default function BlogSubscribeCard({
  email,
  didSubscribe,
  onEmailChange,
  onSubscribe,
}: BlogSubscribeCardProps) {
  return (
    <section className="w-full rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%)] p-6 backdrop-blur-card transition-all duration-200 ease-out md:p-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-bold text-neutral-100 text-heading-3">
          Stay Tuned
        </h2>
        <p className="mt-3 text-body-base text-slate-300">
          Stay ahead in the real estate market with expert insights, buying
          guides, and investment strategies.
        </p>

        <form
          className="mx-auto mt-6 w-full max-w-[424.53px]"
          onSubmit={onSubscribe}
        >
          <label htmlFor="blog-subscribe-email" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <input
              id="blog-subscribe-email"
              type="email"
              required
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="Your email..."
              className="h-12 w-full rounded-full border border-[#242628] bg-[rgba(12,13,13,1)] pl-4.25 pr-31 text-body-sm font-normal tracking-[-0.26px] text-slate-100 outline-none transition-colors duration-200 placeholder:text-[rgba(175,177,182,0.6)] focus:border-brand-blue-light/60"
            />
            <button
              type="submit"
              className="absolute right-1 top-1.5 h-9 rounded-full bg-linear-to-b from-brand-blue-std to-brand-blue-deep px-4 py-2 text-center text-body-sm leading-4 font-semibold tracking-[-2%] whitespace-nowrap text-neutral-950 transition-all duration-300 hover:shadow-[0_0_20px_rgba(77,181,255,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-light/60"
            >
              Subscribe
            </button>
          </div>
        </form>

        <p className="mt-3 text-caption text-slate-400">
          {didSubscribe
            ? "Thanks for subscribing. We will keep your inbox noise-free."
            : "Join 12,000+ real estate professionals who get our weekly market updates"}
        </p>
      </div>
    </section>
  );
}

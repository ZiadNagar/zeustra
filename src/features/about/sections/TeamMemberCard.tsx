import type { ReactElement } from "react";
import type { TeamMember } from "@/features/about/data/aboutPageData";

const TEAM_MEMBER_FALLBACK_IMAGE =
  "/assets/images/brand/zeustra-logo-minimal.svg";

type TeamMemberCardProps = {
  member: TeamMember;
  onClick: (member: TeamMember) => void;
};

const TeamMemberCard = ({ member, onClick }: TeamMemberCardProps): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => onClick(member)}
      className="w-full overflow-hidden text-left transition-all border-2 group rounded-card-xl border-surface-card bg-surface-card hover:border-brand-blue-std/80 hover:shadow-glow-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-std/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      aria-label={`Open ${member.name} profile`}
    >
      <div className="aspect-[1/1.18] overflow-hidden">
        <img
          src={member.image || TEAM_MEMBER_FALLBACK_IMAGE}
          alt={member.name}
          className="object-cover w-full h-full transition-transform duration-500 ease-out transform-gpu group-hover:scale-[1.05]"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            if (event.currentTarget.dataset.fallbackApplied === "true") {
              return;
            }

            event.currentTarget.dataset.fallbackApplied = "true";
            event.currentTarget.src = TEAM_MEMBER_FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="px-5 py-4">
        <h3 className="text-white text-[clamp(1.25rem,2.5vw,1.625rem)] font-semibold transition-colors duration-200 group-hover:text-(--color-brand-blue) text-center">
          {member.name}
        </h3>
        <p className="text-slate-300 text-[clamp(0.875rem,2.5vw,1rem)] transition-colors duration-200 group-hover:text-(--color-brand-blue) text-center">
          {member.title}
        </p>
      </div>
    </button>
  );
};

export default TeamMemberCard;

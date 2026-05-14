import type { ReactElement } from "react";
import { useState } from "react";
import TeamMemberCard from "@/features/about/sections/TeamMemberCard";
import TeamMemberModal from "@/features/about/sections/TeamMemberModal";
import { type TeamMember } from "@/features/about/data/aboutPageData";

type LeadershipSectionProps = {
  members?: TeamMember[];
};

const LeadershipSection = ({
  members,
}: LeadershipSectionProps): ReactElement => {
  // Use passed members prop from server-side fetch (from about.astro)
  // Fallback to empty array - page handles the fetch
  const resolvedMembers: TeamMember[] = members ?? [];

  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(
    null,
  );
  const remainder = resolvedMembers.length % 3;
  const mainMembers: TeamMember[] =
    remainder === 0
      ? resolvedMembers
      : remainder === 1
        ? resolvedMembers.slice(0, -1)
        : resolvedMembers.slice(0, -2);
  const lastMember: TeamMember | null =
    remainder === 1
      ? resolvedMembers[resolvedMembers.length - 1] || null
      : null;
  const lastPair: TeamMember[] =
    remainder === 2 ? resolvedMembers.slice(-2) : [];

  return (
    <>
      <section
        className="px-4 sm:px-6 md:px-8 py-section-y-sm md:py-section-y"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "1200px",
        }}
      >
        <div className="container">
          <header className="text-center">
            <h2
              className="text-transparent bg-linear-to-r from-brand-cyan via-brand-blue-std to-brand-blue-light bg-clip-text"
              style={{
                textShadow: "var(--shadow-hero-accent)",
                fontSize: "clamp(28px, 6vw, 72px)",
                fontWeight: 500,
              }}
            >
              The People Behind the Platform
            </h2>
            <p className="mt-3 text-heading-4 text-slate-300">
              Meet the leadership driving transactions, intelligence, and
              outcomes across Zeustra, combining advisory expertise with
              proprietary technology to improve execution and deliver greater
              value for clients.
            </p>
          </header>

          <div className="grid gap-6 mt-8 md:mt-16 md:grid-cols-2 xl:grid-cols-3">
            {mainMembers.map((member) => (
              <div key={member.name}>
                <TeamMemberCard
                  member={member}
                  onClick={() =>
                    setSelectedMemberIndex(
                      resolvedMembers.findIndex((m) => m.name === member.name),
                    )
                  }
                />
              </div>
            ))}
            {lastMember ? (
              <div
                key={lastMember.name}
                className="xl:col-start-2 xl:col-end-3"
              >
                <TeamMemberCard
                  member={lastMember}
                  onClick={() =>
                    setSelectedMemberIndex(
                      resolvedMembers.findIndex(
                        (m) => m.name === lastMember.name,
                      ),
                    )
                  }
                />
              </div>
            ) : null}
            {lastPair.length === 2 ? (
              <div
                key={`${lastPair[0].name}-${lastPair[1].name}`}
                className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2 xl:col-span-3 xl:flex xl:justify-center xl:gap-6"
              >
                {lastPair.map((member) => (
                  <div
                    key={member.name}
                    className="w-full xl:w-[calc((100%-3rem)/3)] xl:shrink-0"
                  >
                    <TeamMemberCard
                      member={member}
                      onClick={() =>
                        setSelectedMemberIndex(
                          resolvedMembers.findIndex(
                            (m) => m.name === member.name,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <TeamMemberModal
        members={resolvedMembers}
        memberIndex={selectedMemberIndex}
        isOpen={selectedMemberIndex !== null}
        onNavigate={setSelectedMemberIndex}
        onClose={() => setSelectedMemberIndex(null)}
      />
    </>
  );
};

export default LeadershipSection;

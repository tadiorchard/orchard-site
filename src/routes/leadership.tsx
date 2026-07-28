import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import indiraPhoto from "@/assets/Indira-saladi.jpg";
import ramPhoto from "@/assets/ram-saladi.jpg";
import jamesPhoto from "@/assets/james-cantrell.jpg";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — Orchard" },
      { name: "description", content: "Meet the founders and executive leadership team guiding Orchard Corp's physician-centric locum tenens mission." },
      { property: "og:title", content: "Leadership — Orchard" },
      { property: "og:description", content: "Meet the founders and executive leadership team guiding Orchard Corp." },
    ],
  }),
  component: LeadershipPage,
});

type Profile = {
  name: string;
  title: string;
  photo: string;
  bio: string;
};

const founders: Profile[] = [
  {
    name: "Indira Saladi",
    title: "PRESIDENT | BOARD DIRECTOR",
    photo: indiraPhoto,
    bio: "I have led Orchard Corp from a startup into a national locum tenens staffing company with more than $20M in revenue, building on the physician-founded values established by my husband, Dr. N. Ram Saladi. As President for nearly a decade and a Board Director, I oversee our strategic growth, hospital partnerships, and nationwide operational infrastructure using my background as an engineer and IP attorney.",
  },
  {
    name: "N. Ram Saladi",
    title: "CO-FOUNDER / MANAGING HOSPITALIST",
    photo: ramPhoto,
    bio: "An experienced business leader managing corporate strategy, technology integration, and operational growth. Committed to building robust healthcare delivery frameworks and long-term client partnerships across healthcare systems.",
  },
];

const executive: Profile = {
  name: "James Cantrell",
  title: "Chief Executive Officer (CEO)",
  photo: jamesPhoto,
  bio: "As CEO of Orchard Corp, a healthcare staffing firm dedicated to locum tenens, I am leading the organization into a new phase of tremendous growth and innovation. My focus is to expand Orchard's reach, strengthen our partnerships, and redefine what excellence looks like in healthcare staffing.",
};

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <article className="group relative flex flex-col sm:flex-row gap-6 overflow-hidden rounded-2xl border border-[var(--ocean)]/15 bg-white p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-float)] transition-shadow">
      <div className="relative shrink-0 mx-auto sm:mx-0 w-[200px] h-[240px] overflow-hidden rounded-xl bg-[var(--ice)]">
        <img
          src={profile.photo}
          alt={`${profile.name}, ${profile.title}`}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="flex flex-1 min-w-0 flex-col">
        <h3 className="text-xl font-bold text-[var(--deep)] leading-tight">{profile.name}</h3>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ocean)]">
          {profile.title}
        </p>
        <div className="mt-3 h-px w-10 bg-[var(--ocean)]/30" />
        <div className="mt-3 space-y-2.5 text-[13.5px] leading-relaxed text-[var(--muted-foreground)]">
          {profile.bio.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}


function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <span className="inline-block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ocean)]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-4xl md:text-5xl font-bold text-[var(--deep)] leading-tight">
        {title}
      </h2>
      <div className="mx-auto mt-6 h-1 w-16 rounded-full gradient-teal" />
    </div>
  );
}

function LeadershipPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page intro */}
      <section
        className="relative overflow-hidden py-20 md:py-24"
        style={{ background: "linear-gradient(135deg, #EAF3FB 0%, #F1F7FC 100%)" }}
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ocean)]">
            Leadership
          </span>
          <h1 className="mt-4 text-5xl md:text-6xl font-bold text-[var(--deep)] leading-[1.05]">
            The People Behind Orchard
          </h1>
          <p className="mt-6 text-lg text-[var(--muted-foreground)] leading-relaxed">
            A physician-founded, operator-led team committed to precision,
            integrity, and white-glove service across every hospital partnership.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader eyebrow="" title="Founders" />
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {founders.map((p) => (
              <ProfileCard key={p.name} profile={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="h-px w-full bg-[var(--ocean)]/15" />
      </div>

      {/* Executive Leadership */}
      <section className="py-20 md:py-24 bg-[var(--ice)]/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader eyebrow="" title="Executive Leadership" />
          <div className="mt-14 flex justify-center">
            <div className="w-full max-w-3xl">
              <ProfileCard profile={executive} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

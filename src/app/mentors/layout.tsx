import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry Mentors | DevPhoeniX",
  description: "Learn from the best. Our mentors are industry professionals from top tech companies.",
  keywords: ["mentors", "tech experts", "DevPhoeniX mentors", "coding instructors"],
  alternates: {
    canonical: "https://devphoenix.in/mentors",
  }
};

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

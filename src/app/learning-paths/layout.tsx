import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Paths | DevPhoeniX",
  description: "Structured learning journeys from beginner to builder.",
};

export default function LearningPathsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

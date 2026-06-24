import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs | DevPhoeniX",
  description: "Explore our industry-ready programs and premium courses to accelerate your career.",
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

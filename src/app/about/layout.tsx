import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | DevPhoeniX",
  description: "Our vision, mission, and philosophy for the future of education.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

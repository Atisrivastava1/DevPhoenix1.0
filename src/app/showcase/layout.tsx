import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase | DevPhoeniX",
  description: "Real projects built by DevPhoeniX learners.",
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

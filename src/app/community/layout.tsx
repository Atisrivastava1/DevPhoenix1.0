import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | DevPhoeniX",
  description: "Join our thriving ecosystem of builders and creators.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

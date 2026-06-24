import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | DevPhoeniX",
  description: "Read premium educational guides, builder journeys, and industry trends.",
  keywords: ["AI blog", "builder journey", "tech education", "DevPhoeniX blog", "coding tutorials"],
  alternates: {
    canonical: "https://devphoenix.in/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevPhoeniX Blog",
    description: "Read premium educational guides, builder journeys, and industry trends.",
  }
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

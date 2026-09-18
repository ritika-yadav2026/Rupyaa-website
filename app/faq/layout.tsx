import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Rupyaa",
  description:
    "Frequently asked questions about Rupyaa digital loans, eligibility, disbursement, and repayment.",
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

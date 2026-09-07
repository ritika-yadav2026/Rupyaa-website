import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - ZapCash",
  description:
    "Frequently asked questions about ZapCash digital loans, eligibility, disbursement, and repayment.",
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

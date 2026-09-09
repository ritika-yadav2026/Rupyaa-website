import type { ReactElement } from "react";

type SupportTeamQuerySectionProps = {
  readonly totalLoanAmount?: string;
  readonly tenure?: string;
};

function RupeeIcon(): ReactElement {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: "#FDE9B5" }}
      aria-hidden
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-900 text-sm font-semibold text-gray-900">
        ₹
      </span>
    </span>
  );
}

/**
 * Loan summary strip (amount + tenure). Legacy support links kept commented below for reference.
 */
export default function SupportTeamQuerySection({
  totalLoanAmount = "—",
  tenure = "—",
}: SupportTeamQuerySectionProps): ReactElement {
  return (
    <div className="text-left text-sm text-gray-600">
      {/* <p className="mb-1 text-sm text-gray-600">
          For any queries or assistance, visit our Support team
        </p> */}

      {/* <ul className="space-y-2 text-sm my-4">
          <li>
            <a
              href={STRING_CONSTANTS.WHATSAPP_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              WhatsApp Support
            </a>
          </li>
          <li>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Email/Phone Support
            </Link>
          </li>
        </ul>   */}

      <div
        className="mb-4 flex items-stretch overflow-hidden rounded-xl border"
        style={{ backgroundColor: "#FFFDF0", borderColor: "#FBDD9F" }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:px-4 sm:py-3.5">
          <RupeeIcon />
          <div className="min-w-0 text-left">
            <p className="text-xs text-gray-600 sm:text-sm">Total Loan Amount</p>
            <p className="truncate text-base font-bold text-gray-900 sm:text-lg">{totalLoanAmount}</p>
          </div>
        </div>

        <div className="w-px self-stretch bg-[#FBDD9F]/80" aria-hidden />

        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:px-4 sm:py-3.5">
          <RupeeIcon />
          <div className="min-w-0 text-left">
            <p className="text-xs text-gray-600 sm:text-sm">Tenure</p>
            <p className="truncate text-base font-bold text-gray-900 sm:text-lg">{tenure}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

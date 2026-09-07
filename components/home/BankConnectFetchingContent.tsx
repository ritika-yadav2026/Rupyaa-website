import {
  BANK_CONNECT_STATUS_MESSAGES,
} from  "@/utils/app-constants";
import ZapcashLoading from "../ZapcashLoading";

type Props = {
  visible: boolean;
  message?: string;
  subtext?: string;
  needOverlay?: boolean;
};

/**
 * Web equivalent of native `BankConnectFetchingContent`. Single full-screen blocker for BSA
 * (consent wait, polling, offer prep).
 */
export default function BankConnectFetchingContent({
  visible,
  needOverlay = false,
  message = BANK_CONNECT_STATUS_MESSAGES.fetchingBankDetails,
  subtext = '',
}: Props) {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-1000  flex items-center justify-center p-4 ${needOverlay ? 'bg-black/45 backdrop-blur-[2px]' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={`w-full max-w-md rounded-2xl bg-white p-6 text-center gap-2 ${needOverlay ? 'shadow-xl border border-gray-200' : ''}`}>
        <ZapcashLoading />
        <p className="text-base text-gray-900">{message}</p>
        <p className="mt-2 text-sm text-gray-600">{subtext}</p>
      </div>
    </div>
  );
}

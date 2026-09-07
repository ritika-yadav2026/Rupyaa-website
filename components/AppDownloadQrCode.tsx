import QRCode from "react-qr-code";

type AppDownloadQrCodeProps = {
  readonly url: string;
  readonly label: string;
  readonly backgroundColor?: string;
  readonly foregroundColor?: string;
};

export default function AppDownloadQrCode({
  url,
  label,
  backgroundColor = "transparent",
  foregroundColor = "#000000",
}: AppDownloadQrCodeProps) {
  return (
    <span className="hidden size-full items-center justify-center p-3 sm:flex">
      <QRCode
        value={url}
        aria-label={label}
        className="size-full"
        level="M"
        bgColor={backgroundColor}
        fgColor={foregroundColor}
      />
    </span>
  );
}

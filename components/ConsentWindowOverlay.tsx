"use client";

type Props = {
  isOpen: boolean;
  title: string;
  description: string;
};

export default function ConsentWindowOverlay({ isOpen, title, description }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1000 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200 p-6 text-center">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-base font-semibold text-gray-900">{title}</p>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

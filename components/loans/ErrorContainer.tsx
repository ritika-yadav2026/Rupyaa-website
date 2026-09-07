"use client";

export function ErrorContainer({ message }: { message: string | null | undefined }) {
  if (!message?.trim()) return null;
  return (
    <div
      className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      {message}
    </div>
  );
}

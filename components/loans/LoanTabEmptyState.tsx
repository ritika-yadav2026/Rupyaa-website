"use client";

import type { ReactNode } from "react";

export function LoanTabEmptyState({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

"use client";

export default function ComingSoonView() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 text-center mt-5">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
      <p className="text-sm text-gray-600">
        This stage is not yet available on web. Please continue in the app for now.
      </p>
    </div>
  );
}

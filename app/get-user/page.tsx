"use client";

import { useState } from "react";
import Link from "next/link";
import { validateTestUserId } from "@/lib/validation";
import { getUserById, type GetUserResponse } from "@/lib/get-user-encrypted-api";

export default function GetUserPage() {
  const [userId, setUserId] = useState("1");
  const [user, setUser] = useState<GetUserResponse | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleFetch() {
    const idErr = validateTestUserId(userId);
    if (idErr) {
      setError(idErr);
      setUser(undefined);
      return;
    }
    setError(null);
    setUser(undefined);
    setIsLoading(true);
    try {
      const data = await getUserById(userId.trim());
      setUser(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← Back
        </Link>
      </header>
      <main id="main-content" tabIndex={-1} className="flex flex-col gap-6 py-4 sm:py-6 px-3 sm:px-4 md:px-6 max-w-2xl mx-auto w-full outline-none">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Encrypted Get User (Test)
          </h1>
          <p className="text-sm text-gray-600">
            Fetch user by ID (1–10). Request and response are encrypted with
            AES-256-CBC.
          </p>
        </div>

        <form
          className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 p-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void handleFetch();
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <label className="flex flex-col gap-1.5 flex-1" htmlFor="get-user-id">
              <span className="text-sm font-medium text-gray-700">User ID</span>
              <input
                id="get-user-id"
                type="text"
                inputMode="numeric"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value.replace(/\D/g, "").slice(0, 2));
                  setError(null);
                }}
                placeholder="1"
                aria-invalid={validateTestUserId(userId) != null}
                aria-describedby={error ? "get-user-hint get-user-error" : "get-user-hint"}
                className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 min-h-[44px]"
            >
              {isLoading ? "Fetching…" : "Fetch User"}
            </button>
          </div>
          <p id="get-user-hint" className="text-xs text-gray-500">
            Valid IDs: 1 to 10. Any other ID returns &quot;User not found&quot;.
          </p>
        </form>

        {error && (
          <div
            id="get-user-error"
            className="rounded-2xl bg-red-50 border-2 border-red-200 px-6 py-5 flex items-start gap-4"
            role="alert"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-red-600"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {user === null && !error && (
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 px-6 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-amber-600"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="font-medium text-amber-800">User not found</p>
          </div>
        )}

        {user && (
          <div className="rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">User Details</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Decrypted from API response
              </p>
            </div>
            <dl className="divide-y divide-gray-100">
              {user.name != null && (
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-24 shrink-0">
                    Name
                  </dt>
                  <dd className="text-gray-900 font-medium">{user.name}</dd>
                </div>
              )}
              {user.age != null && (
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-24 shrink-0">
                    Age
                  </dt>
                  <dd className="text-gray-900">{user.age}</dd>
                </div>
              )}
              {user.city != null && (
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-24 shrink-0">
                    City
                  </dt>
                  <dd className="text-gray-900">{user.city}</dd>
                </div>
              )}
              {user.Id != null && (
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <dt className="text-sm font-medium text-gray-500 sm:w-24 shrink-0">
                    ID
                  </dt>
                  <dd className="text-gray-900">{user.Id}</dd>
                </div>
              )}
              {user.name == null &&
                user.age == null &&
                user.city == null &&
                user.Id == null && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No user fields available in response.
                  </div>
                )}
            </dl>
          </div>
        )}
      </main>
    </div>
  );
}

export function LoanApplicationHeader({
  applicationDisplay,
  status,
}: {
  applicationDisplay: string;
  status?: string;
}) {
  const isOverdue = status?.toLowerCase() === 'overdue';
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 mb-4 shadow-sm">
      <div className="rounded-lg bg-gray-50 px-4 py-3">
        <p className="text-sm text-gray-800">
          Application: <span className="font-bold">{applicationDisplay}</span>
        </p>
      </div>
      {isOverdue ? (
        <span className="inline-flex rounded-full bg-red-200 px-3 py-1 text-xs font-semibold text-red-700 capitalize">
          LOAN OVERDUE
        </span>
      ) : null}
    </div>
  );
}

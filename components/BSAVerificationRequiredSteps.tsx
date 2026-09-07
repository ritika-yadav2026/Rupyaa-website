import { CheckIcon } from './icons'

const BSAVerificationRequiredSteps = () => {
  return (
    <>
      <div className="space-y-2">
        <p className="text-primary font-semibold">Required:</p>
        <div className="space-y-1.5">
          <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
            <CheckIcon width={16} height={16} />
            <span className="min-w-0 pt-px">Latest statement till yesterday</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
            <CheckIcon width={16} height={16} />
            <span className="min-w-0 pt-px">At least includes last 90 days</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-red-500 text-xs font-semibold leading-none"
              aria-hidden
            >
              ✕
            </span>
            <span className="min-w-0 pt-px">UPI/Mini/Credit-Card statement</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700 leading-snug">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-red-500 text-xs font-semibold leading-none"
              aria-hidden
            >
              ✕
            </span>
            <span className="min-w-0 pt-px">Any other document than statement</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default BSAVerificationRequiredSteps
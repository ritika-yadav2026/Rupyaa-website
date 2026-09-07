import { appShellContainerClassName } from "@/lib/app-shell-layout";

const EMI_FACTORS = [
  {
    title: "Loan Amount",
    description:
      "The amount you borrow plays a big role in your EMI. In most cases, a higher loan amount means a higher monthly payment.",
  },
  {
    title: "Interest Rate",
    description:
      "The interest rate decides how much extra you pay on top of the loan amount. Even a small change in the rate can affect your EMI and the total repayment amount.",
  },
  {
    title: "Loan Tenure",
    description:
      "Loan tenure is the time you take to repay the loan. A longer tenure can reduce your monthly EMI, but the total interest paid may be higher. A shorter tenure can increase your EMI, but it may reduce the total interest.",
  },
] as const;

export default function EMICalculatorInfoSection() {
  return (
    <section className="bg-white pb-20 sm:pb-24 lg:pb-32">
      <div className={`${appShellContainerClassName} space-y-12 sm:space-y-16`}>
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Plan Your Loan <span className="text-primary">Better</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
            Use this EMI calculator to quickly check how much you may need to pay every month.
            Just adjust the loan amount, interest rate, and tenure to see your estimated EMI
            instantly.
          </p>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
            It helps you understand your monthly repayment better and makes it easier to choose
            a loan amount that fits your budget.
          </p>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Affects Your <span className="text-primary">EMI</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
            Your EMI mainly depends on three things:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {EMI_FACTORS.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 sm:p-6"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 italic mt-6 sm:mt-8">
            Note: The EMI shown here is only an estimate. Final loan terms may vary.
          </p>
        </div>
      </div>
    </section>
  );
}

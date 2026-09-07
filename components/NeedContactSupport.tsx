import Link from "next/link"

const NeedContactSupport = () => {
	return (
		<p className="text-center text-xs sm:text-sm text-gray-500 pb-6 px-4">
			Need help? <Link href="/support" className="text-primary font-medium hover:underline">Contact Support</Link>
		</p>
	)
}

export default NeedContactSupport
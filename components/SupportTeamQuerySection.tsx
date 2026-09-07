import { STRING_CONSTANTS } from '@/utils/app-constants'
import Link from 'next/link'

const SupportTeamQuerySection = () => {
  return (
    <>
      <div className="text-left rounded-xl  text-sm text-gray-600">
        <p className="mb-1 text-sm text-gray-600">
          For any queries or assistance, visit our Support team
        </p>

        <ul className="space-y-2 text-sm my-4">
          <li>
            <a
              href={STRING_CONSTANTS.WHATSAPP_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              WhatsApp Support
            </a>
          </li>
          <li>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Email/Phone Support
            </Link>
          </li>
        </ul>  
      </div>
    </>
  )
}

export default SupportTeamQuerySection
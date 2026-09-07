import Image from 'next/image'
import { IMAGES } from '@/lib/images'

export function MyLoanEmptyCard({ title = "No active loans found" }: { title?: string }) {

  const renderNoLoanImage = () => {
    return (
      <div className="flex flex-col relative h-60 aspect-video items-center justify-center gap-4">
        <Image src={IMAGES.noLoan} alt="No Loan" fill  className="object-contain"/>
      </div>
    )
  }
  return (
    <div className="flex flex-col w-full relative h-60 aspect-video items-center justify-center gap-4">
      {renderNoLoanImage()}
      <h2 className="md:text-xl">{title}</h2>
    </div>
  )
}
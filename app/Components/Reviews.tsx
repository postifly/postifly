"use client" 
import React from 'react'
import { useTranslations } from 'next-intl'

type ReviewItem = {
  name: string
  rating: number
  text: string
}

const Reviews = () => {
  const t = useTranslations('reviews')
  const reviews = (t.raw('items') as ReviewItem[]) ?? []
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    if (reviews.length === 0) return
    const timerId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 4200)

    return () => window.clearInterval(timerId)
  }, [reviews.length])

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-10 sm:px-4 md:py-14">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-gray-900 md:mb-9 md:text-3xl">
        {t('title')}
      </h2>

      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[24px] bg-sky-100 p-5 shadow-[0_20px_40px_-24px_rgba(130,76,255,0.7)] sm:p-7">
        <article className="min-h-[170px] rounded-2xl border border-violet-100/80 bg-white/95 p-5 shadow-[0_12px_30px_-20px_rgba(94,37,208,0.65)] sm:p-6">
          <div className="mb-3 text-xl tracking-[2px] text-amber-500">
            {'★'.repeat(reviews[activeIndex]?.rating ?? 0)}
          </div>
          <p className="text-base leading-7 text-gray-700">
            <span className="text-gray-500">&ldquo;</span>
            {reviews[activeIndex]?.text ?? ''}
            <span className="text-gray-500">&rdquo;</span>
          </p>
          <p className="mt-4 text-sm font-bold text-violet-700">{reviews[activeIndex]?.name ?? ''}</p>
        </article>

        <div className="mt-5 flex items-center justify-center gap-2">
          {reviews.map((review, index) => (
            <button
              key={review.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                activeIndex === index ? 'bg-indigo-500' : 'bg-indigo-100 hover:bg-indigo-300'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews
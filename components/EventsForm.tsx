'use client'

import { useState } from 'react'
import { apiRequest, API_ENDPOINTS } from '@/lib/api'
import Image from 'next/image'

type FormData = {
  fullName: string
  email: string
  lineId: string
  igHandle: string
  eventAttended: string
  wellnessClass: string
  productInterest: string
}

const steps = [
  {
    title: { en: 'LUCKY DRAW', th: 'ลุ้นรางวัล' },
    subtitle: { en: 'PERSONAL INFORMATION', th: 'ข้อมูลส่วนตัว' },
    fields: ['fullName', 'email', 'lineId', 'igHandle'],
  },
  {
    question: { en: 'WHICH EVENT DID YOU ATTEND?', th: 'คุณเข้าร่วมอีเว้นท์ไหน?' },
    fields: ['eventAttended'],
    options: [
      { value: 'nextopia', label: { en: 'Nextopia', th: 'Nextopia' } },
      { value: 'stadium', label: { en: 'Stadium', th: 'Stadium' } },
      { value: 'both', label: { en: 'Both', th: 'ทั้งสองอีเว้นท์' } },
    ],
  },
  {
    question: { en: 'WHAT WELLNESS CLASS ARE YOU MOST EXCITED ABOUT?', th: 'คุณรู้สึกตื่นเต้นกับคลาสเวลเนสไหนมากที่สุด?' },
    fields: ['wellnessClass'],
  },
  {
    question: { en: 'WHAT PEACHES PRODUCT DO YOU WANT TO TRY NEXT?', th: 'คุณอยากลองสินค้า Peaches ตัวไหนต่อไป?' },
    fields: ['productInterest'],
  },
]

export default function EventsForm() {
  const [language, setLanguage] = useState<'en' | 'th'>('en')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    lineId: '',
    igHandle: '',
    eventAttended: '',
    wellnessClass: '',
    productInterest: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = steps.length
  const currentStepData = steps[currentStep]

  const handleChange = (value: string, field: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const result = await apiRequest(API_ENDPOINTS.LEADS, {
        method: 'POST',
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: '0000000000',
          company: '',
          position: '',
          source: 'lucky_draw',
          form_data: {
            line_id: formData.lineId,
            ig_handle: formData.igHandle,
            event_attended: formData.eventAttended,
            wellness_class: formData.wellnessClass,
            product_interest: formData.productInterest,
          },
        }),
      })

      if (result.success) {
        console.log('Lucky draw registration successful:', result.data)
        setIsSubmitted(true)
      } else {
        alert(
          language === 'en'
            ? 'Submission failed. Please try again.'
            : 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
        )
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(
        language === 'en'
          ? 'An error occurred. Please try again.'
          : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex flex-col overflow-y-auto font-sans">
        {/* Top Bar */}
        <div className="bg-[#2C2C2C] h-3 w-full" />

        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Image
              src="/images/events/logo.png"
              alt="Peaches Active"
              width={120}
              height={50}
              priority
            />

            {/* Icon Right */}
            <Image
              src="/images/events/icon-right.png"
              alt="Menu"
              width={48}
              height={48}
              priority
            />
          </div>
        </div>

        {/* Success Content */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-md mx-auto text-center space-y-8">
            {/* Title */}
            <h2 className="text-4xl font-serif font-bold text-[#FF8C61] tracking-wider">
              {language === 'en' ? "YOU'RE IN!" : 'คุณลงทะเบียนแล้ว!'}
            </h2>

            {/* Peach Character Image */}
            <div className="py-4">
              <Image
                src="/images/events/peach-success.png"
                alt="Peach character"
                width={300}
                height={300}
                className="mx-auto"
              />
            </div>

            {/* Winners Announcement */}
            <p className="text-sm text-[#2C2C2C]">
              {language === 'en'
                ? 'Winners will be announced on IG & via email.'
                : 'จะประกาศผู้โชคดีทาง IG และอีเมล'}
            </p>

            {/* Follow Section */}
            <div className="pt-4">
              <h3 className="text-2xl font-serif italic text-[#2C2C2C] mb-2">FOLLOW</h3>
              <p className="text-3xl font-serif italic text-[#2C2C2C] mb-1">
                Peaches Active<sup className="text-sm">®</sup>
              </p>
              <p className="text-sm text-[#2C2C2C] mb-6 font-sans">
                {language === 'en' ? 'for bonus entries' : 'สำหรับโอกาสเพิ่มเติม'}
              </p>

              {/* Social Media Links */}
              <div className="space-y-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com/peaches.activewear"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-[#E5DDD5] hover:border-[#FF8C61] transition-colors font-sans"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#2C2C2C]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-[#2C2C2C]">peaches.activewear</span>
                  </div>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@peaches.active"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-[#E5DDD5] hover:border-[#FF8C61] transition-colors font-sans"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#2C2C2C]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    <span className="text-[#2C2C2C]">@peaches.active</span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/peaches.active"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-[#E5DDD5] hover:border-[#FF8C61] transition-colors font-sans"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#2C2C2C]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-[#2C2C2C]">peaches.active</span>
                  </div>
                </a>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-6">
                <a
                  href="https://peaches.active/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#FF8C61] text-white font-sans font-bold rounded-2xl hover:bg-[#FF7A4D] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {language === 'en' ? 'View PAC class schedule' : 'ดูตารางคลาส PAC'}
                </a>

                <a
                  href="https://line.me/R/ti/p/@peachesactive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#FF8C61] text-white font-sans font-bold rounded-2xl hover:bg-[#FF7A4D] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  {language === 'en' ? 'Join LINE community' : 'เข้าร่วมชุมชน LINE'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-[#2C2C2C] h-3 w-full" />

      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          {/* Logo */}
          <Image
            src="/images/events/logo.png"
            alt="Peaches Active"
            width={120}
            height={50}
            priority
          />

          {/* Icon Right */}
          <Image
            src="/images/events/icon-right.png"
            alt="Menu"
            width={48}
            height={48}
            priority
          />
        </div>

        {/* Language Selector */}
        <div className="flex justify-center mb-8">
          <button className="px-4 py-2 text-sm font-medium text-[#2C2C2C] border border-[#2C2C2C] rounded-md flex items-center gap-2 font-sans">
            {language === 'en' ? 'EN' : 'TH'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="h-1 bg-[#E5DDD5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF8C61] transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <div className="absolute -top-6 right-0 text-sm font-medium text-[#FF8C61] font-sans">
            {currentStep + 1}/{totalSteps}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 pb-6">
        {/* Title or Question */}
        <div className="mb-12 text-center">
          {currentStepData.question ? (
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2 px-4 font-sans">
              {currentStepData.question[language]}
            </h2>
          ) : (
            <>
              <h2 className="text-3xl font-serif font-bold text-[#FF8C61] mb-2 tracking-wider">
                {currentStepData.title?.[language]}
              </h2>
              <p className="text-sm text-[#2C2C2C] font-medium tracking-wider font-sans">
                {currentStepData.subtitle?.[language]}
              </p>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-12">
          {currentStepData.fields.includes('fullName') && (
            <div>
              <label className="block text-center text-sm font-medium text-[#2C2C2C] mb-3 font-sans">
                {language === 'en' ? 'Full Name' : 'ชื่อ-นามสกุล'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange(e.target.value, 'fullName')}
                className="w-full bg-transparent border-b border-[#2C2C2C] pb-3 text-center text-[#2C2C2C] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF8C61] transition-colors font-sans"
                placeholder=""
              />
            </div>
          )}

          {currentStepData.fields.includes('email') && (
            <div>
              <label className="block text-center text-sm font-medium text-[#2C2C2C] mb-3 font-sans">
                {language === 'en' ? 'Email' : 'อีเมล'}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange(e.target.value, 'email')}
                className="w-full bg-transparent border-b border-[#2C2C2C] pb-3 text-center text-[#2C2C2C] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF8C61] transition-colors font-sans"
                placeholder=""
              />
            </div>
          )}

          {currentStepData.fields.includes('lineId') && (
            <div>
              <label className="block text-center text-sm font-medium text-[#2C2C2C] mb-3 font-sans">
                {language === 'en' ? 'LINE ID' : 'ไลน์ไอดี'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lineId}
                onChange={(e) => handleChange(e.target.value, 'lineId')}
                className="w-full bg-transparent border-b border-[#2C2C2C] pb-3 text-center text-[#2C2C2C] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF8C61] transition-colors font-sans"
                placeholder=""
              />
            </div>
          )}

          {currentStepData.fields.includes('igHandle') && (
            <div>
              <label className="block text-center text-sm font-medium text-[#2C2C2C] mb-3 font-sans">
                {language === 'en' ? 'IG Handle' : 'ไอจี'}
              </label>
              <input
                type="text"
                value={formData.igHandle}
                onChange={(e) => handleChange(e.target.value, 'igHandle')}
                className="w-full bg-transparent border-b border-[#2C2C2C] pb-3 text-center text-[#2C2C2C] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF8C61] transition-colors font-sans"
                placeholder=""
              />
            </div>
          )}

          {currentStepData.fields.includes('eventAttended') && currentStepData.options && (
            <div className="space-y-4">
              {currentStepData.options.map((option: any) => (
                <button
                  key={option.value}
                  onClick={() => handleChange(option.value, 'eventAttended')}
                  className={`w-full px-6 py-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 font-sans ${
                    formData.eventAttended === option.value
                      ? 'border-[#FF8C61] bg-white shadow-md'
                      : 'border-[#E5DDD5] bg-white hover:border-[#FF8C61]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.eventAttended === option.value
                        ? 'border-[#FF8C61]'
                        : 'border-[#9CA3AF]'
                    }`}
                  >
                    {formData.eventAttended === option.value && (
                      <div className="w-3 h-3 rounded-full bg-[#FF8C61]" />
                    )}
                  </div>
                  <span className="text-lg text-[#2C2C2C]">{option.label[language]}</span>
                </button>
              ))}
            </div>
          )}

          {currentStepData.fields.includes('wellnessClass') && (
            <div>
              <textarea
                value={formData.wellnessClass}
                onChange={(e) => handleChange(e.target.value, 'wellnessClass')}
                rows={4}
                className="w-full bg-transparent border-b border-[#2C2C2C] pb-3 text-[#2C2C2C] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF8C61] transition-colors resize-none font-sans"
                placeholder=""
              />
            </div>
          )}

          {currentStepData.fields.includes('productInterest') && (
            <div>
              <textarea
                value={formData.productInterest}
                onChange={(e) => handleChange(e.target.value, 'productInterest')}
                rows={4}
                className="w-full bg-transparent border-b border-[#2C2C2C] pb-3 text-[#2C2C2C] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF8C61] transition-colors resize-none font-sans"
                placeholder=""
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 pb-8">
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex-1 py-4 bg-[#9CA3AF] text-white font-medium rounded-full hover:bg-[#6B7280] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'en' ? 'Back' : 'ย้อนกลับ'}
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex-1 py-4 bg-[#2C2C2C] text-white font-medium rounded-full hover:bg-[#3C3C3C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans"
          >
            {isSubmitting ? (
              language === 'en' ? 'Submitting...' : 'กำลังส่ง...'
            ) : currentStep === totalSteps - 1 ? (
              <>
                {language === 'en' ? 'Submit' : 'ส่งข้อมูล'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                {language === 'en' ? 'Next' : 'ถัดไป'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

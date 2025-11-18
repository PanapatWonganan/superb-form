'use client'

import { useState, useEffect } from 'react'
import { calculateSize, SizeRecommendation } from '@/utils/sizeCalculator'
import ResultPage from './ResultPage'

type Question = {
  id: number
  section?: {
    en: string
    th: string
  }
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'multiselect'
  question: {
    en: string
    th: string
  }
  placeholder?: {
    en: string
    th: string
  }
  options?: {
    en: string[]
    th: string[]
  }
  required?: boolean
}

const questions: Question[] = [
  {
    id: 1,
    section: {
      en: '👤 Personal Information',
      th: '👤 ข้อมูลส่วนตัว',
    },
    type: 'text',
    question: {
      en: "Hi! What's your name?",
      th: 'สวัสดีค่ะ! คุณชื่ออะไรคะ?',
    },
    placeholder: {
      en: 'Type your name here...',
      th: 'พิมพ์ชื่อของคุณที่นี่...',
    },
    required: true,
  },
  {
    id: 2,
    section: {
      en: '👤 Personal Information',
      th: '👤 ข้อมูลส่วนตัว',
    },
    type: 'email',
    question: {
      en: 'What is your email address?',
      th: 'อีเมลของคุณคืออะไรคะ?',
    },
    placeholder: {
      en: 'name@example.com',
      th: 'name@example.com',
    },
    required: true,
  },
  {
    id: 3,
    section: {
      en: '📏 Body Measurements',
      th: '📏 ข้อมูลการวัดขนาด',
    },
    type: 'number',
    question: {
      en: "What's your height?",
      th: 'ส่วนสูงของคุณเท่าไหร่?',
    },
    placeholder: {
      en: 'Enter in cm (e.g., 160)',
      th: 'ระบุเป็น cm (เช่น 160)',
    },
    required: true,
  },
  {
    id: 4,
    section: {
      en: '📏 Body Measurements',
      th: '📏 ข้อมูลการวัดขนาด',
    },
    type: 'number',
    question: {
      en: 'What is your weight?',
      th: 'น้ำหนักของคุณเท่าไหร่?',
    },
    placeholder: {
      en: 'Enter in kg (e.g., 55)',
      th: 'ระบุเป็น kg (เช่น 55)',
    },
    required: true,
  },
  {
    id: 5,
    section: {
      en: '📏 Body Measurements',
      th: '📏 ข้อมูลการวัดขนาด',
    },
    type: 'number',
    question: {
      en: 'What is your bust measurement?',
      th: 'รอบอกของคุณเท่าไหร่?',
    },
    placeholder: {
      en: 'Enter in cm (e.g., 85)',
      th: 'ระบุเป็น cm (เช่น 85)',
    },
    required: true,
  },
  {
    id: 6,
    section: {
      en: '📏 Body Measurements',
      th: '📏 ข้อมูลการวัดขนาด',
    },
    type: 'number',
    question: {
      en: 'What is your waist measurement?',
      th: 'รอบเอวของคุณเท่าไหร่?',
    },
    placeholder: {
      en: 'Enter in cm (e.g., 68)',
      th: 'ระบุเป็น cm (เช่น 68)',
    },
    required: true,
  },
  {
    id: 7,
    section: {
      en: '📏 Body Measurements',
      th: '📏 ข้อมูลการวัดขนาด',
    },
    type: 'number',
    question: {
      en: 'What is your hip measurement?',
      th: 'รอบสะโพกของคุณเท่าไหร่?',
    },
    placeholder: {
      en: 'Enter in cm (e.g., 92)',
      th: 'ระบุเป็น cm (เช่น 92)',
    },
    required: true,
  },
  {
    id: 8,
    section: {
      en: '💪 Your Workout Style',
      th: '💪 รูปแบบการออกกำลังกาย',
    },
    type: 'select',
    question: {
      en: 'What is your preferred fit?',
      th: 'คุณชอบความฟิตแบบไหน?',
    },
    options: {
      en: ['Tight (Compression fit)', 'Regular (Standard fit)', 'Loose (Relaxed fit)'],
      th: ['รัดกุม (แบบคอมเพรสชั่น)', 'พอดี (แบบมาตรฐาน)', 'หลวม (แบบสบายๆ)'],
    },
    required: true,
  },
  {
    id: 9,
    section: {
      en: '💪 Your Workout Style',
      th: '💪 รูปแบบการออกกำลังกาย',
    },
    type: 'multiselect',
    question: {
      en: 'What type of activities do you do? (Select all that apply)',
      th: 'คุณทำกิจกรรมประเภทไหนบ้าง? (เลือกได้หลายข้อ)',
    },
    options: {
      en: ['Yoga', 'Running', 'Gym/Weight Training', 'Dance/Aerobics', 'Pilates', 'Other Sports'],
      th: ['โยคะ', 'วิ่ง', 'ฟิตเนส/ยกน้ำหนัก', 'เต้น/แอโรบิก', 'พิลาทิส', 'กีฬาอื่นๆ'],
    },
    required: true,
  },
  {
    id: 10,
    section: {
      en: '🎨 Style Preferences',
      th: '🎨 ความชอบเรื่องสไตล์',
    },
    type: 'multiselect',
    question: {
      en: 'What colors do you prefer? (Select all that apply)',
      th: 'คุณชอบสีอะไรบ้าง? (เลือกได้หลายข้อ)',
    },
    options: {
      en: ['Black', 'White', 'Gray', 'Navy Blue', 'Pink', 'Purple', 'Earth Tones'],
      th: ['สีดำ', 'สีขาว', 'สีเทา', 'น้ำเงินเข้ม', 'สีชมพู', 'สีม่วง', 'โทนสีธรรมชาติ'],
    },
    required: false,
  },
  {
    id: 11,
    section: {
      en: '🎨 Style Preferences',
      th: '🎨 ความชอบเรื่องสไตล์',
    },
    type: 'select',
    question: {
      en: 'What is your budget range per set?',
      th: 'งบประมาณต่อชุดของคุณอยู่ที่เท่าไหร่?',
    },
    options: {
      en: ['Under 1,000 THB', '1,000 - 2,000 THB', '2,000 - 3,500 THB', 'Above 3,500 THB'],
      th: ['ต่ำกว่า 1,000 บาท', '1,000 - 2,000 บาท', '2,000 - 3,500 บาท', 'มากกว่า 3,500 บาท'],
    },
    required: false,
  },
  {
    id: 12,
    section: {
      en: '💬 Additional Information',
      th: '💬 ข้อมูลเพิ่มเติม',
    },
    type: 'textarea',
    question: {
      en: 'Any specific concerns or preferences about sizing?',
      th: 'มีข้อกังวลหรือความต้องการพิเศษเรื่องไซส์ไหมคะ?',
    },
    placeholder: {
      en: 'Share any additional details...',
      th: 'แบ่งปันรายละเอียดเพิ่มเติม...',
    },
    required: false,
  },
]

export default function SurveyForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [currentAnswer, setCurrentAnswer] = useState<any>('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [language, setLanguage] = useState<'en' | 'th'>('th') // Default to Thai
  const [sizeRecommendation, setSizeRecommendation] = useState<SizeRecommendation | null>(null)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  useEffect(() => {
    // Load current answer when question changes
    const question = questions[currentQuestion]
    if (answers[question.id] !== undefined) {
      setCurrentAnswer(answers[question.id])
    } else {
      setCurrentAnswer(question.type === 'multiselect' ? [] : '')
    }
  }, [currentQuestion, answers])

  const handleNext = () => {
    const question = questions[currentQuestion]

    // Validation
    if (question.required && !currentAnswer) {
      alert(language === 'en' ? 'This question is required' : 'กรุณาตอบคำถามนี้')
      return
    }

    if (question.required && question.type === 'multiselect' && currentAnswer.length === 0) {
      alert(language === 'en' ? 'Please select at least one option' : 'กรุณาเลือกอย่างน้อย 1 ข้อ')
      return
    }

    // Save answer
    setAnswers({ ...answers, [question.id]: currentAnswer })
    setDirection('forward')

    // Move to next question or submit
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection('backward')
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    const finalAnswers = { ...answers, [questions[currentQuestion].id]: currentAnswer }
    console.log('Survey submitted:', finalAnswers)

    // Calculate size recommendation
    // Question IDs: 5=bust, 6=waist, 7=hips, 8=fitPreference
    const bust = parseFloat(finalAnswers[5]) || 0
    const waist = parseFloat(finalAnswers[6]) || 0
    const hips = parseFloat(finalAnswers[7]) || 0
    const fitPreference = finalAnswers[8] || ''

    const recommendation = calculateSize(bust, waist, hips, fitPreference)
    setSizeRecommendation(recommendation)
    setIsSubmitted(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const question = questions[currentQuestion]
      if (question.type !== 'textarea') {
        e.preventDefault()
        handleNext()
      }
    }
  }

  const handleMultiselectToggle = (option: string) => {
    const current = currentAnswer as string[]
    if (current.includes(option)) {
      setCurrentAnswer(current.filter((item: string) => item !== option))
    } else {
      setCurrentAnswer([...current, option])
    }
  }

  if (isSubmitted && sizeRecommendation) {
    return (
      <ResultPage
        sizeRecommendation={sizeRecommendation}
        answers={{ ...answers, [questions[currentQuestion].id]: currentAnswer }}
        language={language}
        onReset={() => {
          setIsSubmitted(false)
          setCurrentQuestion(0)
          setAnswers({})
          setCurrentAnswer('')
          setSizeRecommendation(null)
        }}
      />
    )
  }

  const question = questions[currentQuestion]

  // Check if we need to show section header (first question or section changed)
  const showSectionHeader =
    currentQuestion === 0 ||
    questions[currentQuestion].section?.[language] !== questions[currentQuestion - 1]?.section?.[language]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Language Toggle */}
      <div className="fixed top-6 left-6 z-50">
        <div className="inline-flex rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              language === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('th')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              language === 'th'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            TH
          </button>
        </div>
      </div>

      {/* Question Counter */}
      <div className="fixed top-6 right-6 text-sm text-gray-500 font-medium">
        {currentQuestion + 1} / {questions.length}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div
            key={currentQuestion}
            className={`animate-slide-up ${
              direction === 'backward' ? 'animate-fade-in' : ''
            }`}
          >
            {/* Section Header */}
            {question.section && showSectionHeader && (
              <div className="text-sm font-semibold text-blue-600 mb-4 uppercase tracking-wide">
                {question.section[language]}
              </div>
            )}

            {/* Question */}
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 leading-tight">
              {question.question[language]}
            </h2>

            {/* Answer Input */}
            <div className="space-y-4">
              {question.type === 'text' && (
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={question.placeholder?.[language]}
                  className="w-full px-4 py-4 text-xl border-b-2 border-gray-300 focus:border-blue-600 outline-none bg-transparent transition-colors"
                  autoFocus
                />
              )}

              {question.type === 'email' && (
                <input
                  type="email"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={question.placeholder?.[language]}
                  className="w-full px-4 py-4 text-xl border-b-2 border-gray-300 focus:border-blue-600 outline-none bg-transparent transition-colors"
                  autoFocus
                />
              )}

              {question.type === 'number' && (
                <input
                  type="number"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={question.placeholder?.[language]}
                  className="w-full px-4 py-4 text-xl border-b-2 border-gray-300 focus:border-blue-600 outline-none bg-transparent transition-colors"
                  autoFocus
                />
              )}

              {question.type === 'textarea' && (
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder={question.placeholder?.[language]}
                  rows={5}
                  className="w-full px-4 py-4 text-xl border-2 border-gray-300 focus:border-blue-600 outline-none bg-white rounded-lg transition-colors resize-none"
                  autoFocus
                />
              )}

              {question.type === 'select' && (
                <div className="space-y-3">
                  {question.options?.[language]?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAnswer(option)}
                      className={`w-full px-6 py-4 text-left text-lg rounded-lg border-2 transition-all hover:border-blue-600 hover:bg-blue-50 ${
                        currentAnswer === option
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'multiselect' && (
                <div className="space-y-3">
                  {question.options?.[language]?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleMultiselectToggle(option)}
                      className={`w-full px-6 py-4 text-left text-lg rounded-lg border-2 transition-all hover:border-blue-600 hover:bg-blue-50 ${
                        (currentAnswer as string[]).includes(option)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                            (currentAnswer as string[]).includes(option)
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {(currentAnswer as string[]).includes(option) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'en' ? 'Previous' : 'ก่อนหน้า'}
        </button>

        <button
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          {currentQuestion < questions.length - 1
            ? language === 'en'
              ? 'Next'
              : 'ถัดไป'
            : language === 'en'
            ? 'Submit'
            : 'ส่งข้อมูล'}
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
        {language === 'en' ? (
          <>
            Press <kbd className="px-2 py-1 bg-white rounded shadow">Enter ↵</kbd> to continue
          </>
        ) : (
          <>
            กด <kbd className="px-2 py-1 bg-white rounded shadow">Enter ↵</kbd> เพื่อดำเนินการต่อ
          </>
        )}
      </div>
    </div>
  )
}

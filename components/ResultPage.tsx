'use client'

import { SizeRecommendation, Size } from '@/utils/sizeCalculator'

interface ResultPageProps {
  sizeRecommendation: SizeRecommendation
  answers: Record<number, any>
  language: 'en' | 'th'
  onReset: () => void
}

export default function ResultPage({ sizeRecommendation, answers, language, onReset }: ResultPageProps) {
  const { recommendedSize, confidenceScore, fitScore, alternativeSizes } = sizeRecommendation

  const getFitIcon = (fit: string) => {
    if (fit === 'perfect' || fit === 'good') {
      return (
        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    )
  }

  const getFitLabel = (fit: string) => {
    const labels = {
      en: {
        perfect: 'Perfect Fit',
        good: 'Good Fit',
        loose: 'Slightly Loose',
        tight: 'Slightly Tight',
      },
      th: {
        perfect: 'พอดีมาก',
        good: 'พอดีดี',
        loose: 'หลวมเล็กน้อย',
        tight: 'รัดเล็กน้อย',
      },
    }
    return labels[language][fit as keyof typeof labels.en] || fit
  }

  const mockProducts = [
    {
      id: 1,
      name: language === 'en' ? 'Essential Sports Bra' : 'เสื้อบราออกกำลังกาย',
      price: 1290,
      image: '🏃‍♀️',
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: language === 'en' ? 'High-Waist Leggings' : 'กางเกงเลกกิ้งเอวสูง',
      price: 1690,
      image: '👖',
      rating: 4.9,
      reviews: 567,
    },
    {
      id: 3,
      name: language === 'en' ? 'Breathable Tank Top' : 'เสื้อกล้ามระบายอากาศ',
      price: 890,
      image: '👕',
      rating: 4.7,
      reviews: 189,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {language === 'en' ? 'Your Perfect Size!' : 'ไซส์ที่เหมาะกับคุณ!'}
          </h1>
          <p className="text-gray-600">
            {language === 'en'
              ? 'Based on your measurements and preferences'
              : 'จากข้อมูลการวัดและความชอบของคุณ'}
          </p>
        </div>

        {/* Size Recommendation Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-600 text-white rounded-full text-6xl font-bold mb-4">
              {recommendedSize}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {language === 'en' ? 'Your Recommended Size' : 'ไซส์ที่แนะนำสำหรับคุณ'}
            </h2>
            <div className="flex items-center justify-center gap-2 text-lg">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-gray-700">{confidenceScore}%</span>
              </div>
              <span className="text-gray-500">
                {language === 'en' ? 'Match Confidence' : 'ความมั่นใจ'}
              </span>
            </div>
          </div>

          {/* Fit Visualization */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {language === 'en' ? 'Size Fit Analysis' : 'การวิเคราะห์ความฟิต'}
            </h3>
            <div className="space-y-4">
              {/* Bust */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFitIcon(fitScore.bust)}
                  <div>
                    <div className="font-medium text-gray-800">
                      {language === 'en' ? 'Bust' : 'รอบอก'}
                    </div>
                    <div className="text-sm text-gray-600">{answers[5]} cm</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">{getFitLabel(fitScore.bust)}</div>
              </div>

              {/* Waist */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFitIcon(fitScore.waist)}
                  <div>
                    <div className="font-medium text-gray-800">
                      {language === 'en' ? 'Waist' : 'รอบเอว'}
                    </div>
                    <div className="text-sm text-gray-600">{answers[6]} cm</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">{getFitLabel(fitScore.waist)}</div>
              </div>

              {/* Hips */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFitIcon(fitScore.hips)}
                  <div>
                    <div className="font-medium text-gray-800">
                      {language === 'en' ? 'Hips' : 'รอบสะโพก'}
                    </div>
                    <div className="text-sm text-gray-600">{answers[7]} cm</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">{getFitLabel(fitScore.hips)}</div>
              </div>
            </div>

            {/* Model Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-blue-800">
                  {language === 'en'
                    ? `Models wearing size ${recommendedSize} typically have similar measurements to yours.`
                    : `โมเดลที่ใส่ไซส์ ${recommendedSize} มักมีสัดส่วนใกล้เคียงกับคุณ`}
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Sizes */}
          {alternativeSizes.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {language === 'en' ? 'Alternative Sizes' : 'ไซส์ทางเลือก'}
              </h3>
              <div className="flex gap-2">
                {alternativeSizes.map((size) => (
                  <div
                    key={size}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {language === 'en' ? 'Recommended for You' : 'แนะนำสำหรับคุณ'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-8xl">
                  {product.image}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {language === 'en' ? `Size ${recommendedSize}` : `ไซส์ ${recommendedSize}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? '🎉 Special Offer Just for You!' : '🎉 ข้อเสนอพิเศษสำหรับคุณ!'}
          </h2>
          <p className="text-xl mb-2">
            {language === 'en' ? 'Complete your purchase within 15 minutes' : 'ซื้อภายใน 15 นาที'}
          </p>
          <p className="text-3xl font-bold mb-6">
            {language === 'en' ? 'Get 15% OFF' : 'รับส่วนลด 15%'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              {language === 'en' ? 'Shop My Size Now' : 'ช้อปไซส์ของฉันเลย'}
            </button>
            <button
              onClick={onReset}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              {language === 'en' ? 'Start Over' : 'เริ่มใหม่'}
            </button>
          </div>
          <p className="text-sm mt-4 opacity-90">
            ✅ {language === 'en' ? 'Free Size Exchange Guarantee' : 'รับประกันเปลี่ยนไซส์ฟรี'}
          </p>
        </div>

        {/* Social Proof */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {language === 'en'
                ? 'Join 1,247+ women with similar measurements'
                : 'ผู้หญิง 1,247+ คนที่มีสัดส่วนใกล้เคียงกัน'}
            </h3>
            <p className="text-gray-600">
              {language === 'en'
                ? `who love wearing size ${recommendedSize}`
                : `ที่ชอบใส่ไซส์ ${recommendedSize}`}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-2">4.9/5.0 {language === 'en' ? 'Rating' : 'คะแนน'}</p>
        </div>
      </div>
    </div>
  )
}

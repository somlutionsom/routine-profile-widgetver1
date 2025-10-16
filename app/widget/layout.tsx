import type { Viewport } from 'next'
import Script from 'next/script'

// 위젯 임베드 전용 viewport 설정 (모바일 노션 앱 호환성)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,  // 모바일 WebView 호환성을 위해 제한 완화
  userScalable: true,
}

export default function WidgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* crypto-js를 CDN으로 로드 (모바일 WebView 호환성) */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  )
}


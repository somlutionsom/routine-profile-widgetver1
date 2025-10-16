'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import CryptoJS from 'crypto-js'
import Image from 'next/image'
import './widget.css'

interface WidgetData {
  profileImage: string | null
  sleep: string
  energy: number
  name: string
  mainText: string
}

interface ThemeConfig {
  bg: string
  accent: string
  text: string
  border: string
  secondary: string
}

const THEME_COLORS: Record<string, ThemeConfig> = {
  pink: {
    bg: '#FFCEE4',
    accent: '#FFB9D9',
    text: '#2C2C2C',
    border: '#FFB9D9',
    secondary: '#FFE5F0'
  },
  purple: {
    bg: '#E8D5FF',
    accent: '#D4B5FF',
    text: '#2C2C2C',
    border: '#D4B5FF',
    secondary: '#F3F3F3'
  },
  blue: {
    bg: '#D5E8FF',
    accent: '#B5D4FF',
    text: '#2C2C2C',
    border: '#B5D4FF',
    secondary: '#F3F3F3'
  },
  mono: {
    bg: '#4C4C4C',
    accent: '#404040',
    text: '#000000',
    border: '#404040',
    secondary: '#E0E0E0'
  },
  'pastel-blue': {
    bg: '#E6F3FF',
    accent: '#B3D9FF',
    text: '#2C2C2C',
    border: '#B3D9FF',
    secondary: '#F0F8FF'
  },
  'pastel-purple': {
    bg: '#F0E6FF',
    accent: '#D9B3FF',
    text: '#2C2C2C',
    border: '#D9B3FF',
    secondary: '#F8F0FF'
  }
}

function WidgetContent() {
  const searchParams = useSearchParams()
  const [data, setData] = useState<WidgetData | null>(null)
  const [config, setConfig] = useState<any>(null)
  const [currentTheme, setCurrentTheme] = useState('pink')
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const encryptedConfig = searchParams.get('config')
    if (encryptedConfig) {
      try {
        const decrypted = CryptoJS.AES.decrypt(
          decodeURIComponent(encryptedConfig),
          process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-32-characters-minimum!'
        ).toString(CryptoJS.enc.Utf8)
        
        const cfg = JSON.parse(decrypted)
        setConfig(cfg)
        setCurrentTheme(cfg.theme || 'pink')
        fetchData(cfg)
      } catch (err: any) {
        console.error('Config decrypt error:', err)
        setError('설정을 불러올 수 없습니다')
        setLoading(false)
      }
    } else {
      setError('위젯 URL이 올바르지 않습니다')
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      // 6. AM/PM 형식으로 표시 (예: 03:06 pm)
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }).toLowerCase()) // pm, am 소문자로
      setCurrentDate(now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '. ').replace(/\. $/, '').trim())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (config) {
      const interval = setInterval(() => {
        fetchData(config)
      }, 600000) // 10분마다 자동 새로고침
      return () => clearInterval(interval)
    }
  }, [config])

  const fetchData = async (cfg: any) => {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/notion/widget-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: cfg.token,
          databaseId: cfg.databaseId
        })
      })
      
      if (res.ok) {
        const widgetData = await res.json()
        setData(widgetData)
      } else {
        setError('데이터를 불러올 수 없습니다')
      }
    } catch (err: any) {
      console.error('Data fetch error:', err)
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const cycleTheme = () => {
    const themes = Object.keys(THEME_COLORS)
    const currentIndex = themes.indexOf(currentTheme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setCurrentTheme(nextTheme)
  }

  const theme = THEME_COLORS[currentTheme]

  // 테마별 아이콘 경로 반환 함수
  const getThemedIcon = (iconName: string) => {
    const themePrefix: Record<string, string> = {
      'pink': '',
      'purple': 'purple_',
      'blue': 'blue_',
      'mono': 'black_',
      'pastel-blue': 'blue_',
      'pastel-purple': 'purple_'
    }
    
    const prefix = themePrefix[currentTheme] || ''
    
    // 아이콘 이름별 파일명 매핑
    const iconMap: Record<string, string> = {
      'battery': prefix ? `${prefix}battery.png` : 'battery.png',
      'moon': prefix ? `${prefix}moon.png` : 'moon.png',
      'bracket-left': prefix ? `${prefix}꺽쇠.png` : 'bracket-left.png',
      'bracket-right': prefix ? `${prefix}꺽쇠2.png` : 'bracket-right.png'
    }
    
    return `/images/${iconMap[iconName] || iconName}`
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg, 
      display: 'flex', 
      alignItems: 'flex-start',  // 모바일 WebView 호환성: center → flex-start
      justifyContent: 'center',
      padding: '0.5rem',  // 모바일 여백 확보
      overflow: 'visible',  // 스크롤 허용
    }}>
      <div 
        className="widget-container"
        onClick={cycleTheme}
        style={{ 
          fontFamily: 'Galmuri7, Galmuri, monospace',
          backgroundImage: 'url(/images/window.png)',
          backgroundSize: '350px 450px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: 'transparent',
        }}
      >
      <div className="widget-inner">
        {/* 헤더: profile 텍스트 + X 버튼 */}
        <div className="header-section" data-testid="header">
          <div className="profile-badge" data-testid="profile-badge">
            <span 
              className="profile-text" 
              data-testid="profile-text"
              style={{ 
                color: theme.text,
                backgroundColor: theme.secondary
              }}
            >
              profile
            </span>
            <span 
              className="close-button" 
              data-testid="close-btn"
              style={{ color: theme.accent }}
            >×</span>
          </div>
        </div>
        
        {/* 시간 표시 */}
        <div className="time-section" data-testid="time-section">
          <div 
            className="time-badge"
            data-testid="time-badge"
            style={{ 
              backgroundColor: theme.secondary,
              color: theme.text 
            }}
          >
            {currentTime}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="animate-pulse">
              <div className="text-4xl">⏳</div>
              <p style={{ color: theme.text, marginTop: '8px', fontSize: '14px' }}>데이터 로딩 중...</p>
            </div>
          </div>
        ) : error ? (
          <div className="error-state">
            <div>
              <div className="text-4xl">⚠️</div>
              <p className="text-sm" style={{ color: theme.text, marginTop: '8px' }}>{error}</p>
              <p style={{ color: theme.text, marginTop: '4px', fontSize: '10px' }}>
                모바일 앱에서 이 메시지가 보인다면 설정을 확인해주세요
              </p>
            </div>
          </div>
        ) : data ? (
          <>
            {/* 프로필 이미지 + 스탯(에너지/수면) 영역 */}
            <div className="profile-stats-section" data-testid="profile-stats">
              {/* 프로필 이미지 */}
              <div className="profile-image-wrapper" data-testid="profile-image">
                {data.profileImage ? (
                  <Image 
                    src={data.profileImage} 
                    alt="Profile"
                    width={160}
                    height={160}
                    style={{ 
                      imageRendering: 'pixelated',
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                    unoptimized
                  />
                ) : (
                  <Image 
                    src="/images/default-profile.png" 
                    alt="Default Profile"
                    width={160}
                    height={160}
                    style={{ 
                      imageRendering: 'pixelated',
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                )}
              </div>

              {/* 스탯: 에너지/수면 */}
              <div className="stats-wrapper" data-testid="stats">
                {/* 에너지 */}
                <div className="energy-stat" data-testid="energy">
                  <Image 
                    src={getThemedIcon('battery')}
                    alt="Energy"
                    width={24}
                    height={24}
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <span className="stat-value" data-testid="energy-value" style={{ color: theme.text }}>
                    {Math.round((data.energy || 0) * 20)}%
                  </span>
                </div>
                {/* 수면시간 */}
                <div className="sleep-stat" data-testid="sleep">
                  <Image 
                    src={getThemedIcon('moon')}
                    alt="Sleep"
                    width={24}
                    height={24}
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <span className="stat-value" data-testid="sleep-value" style={{ color: theme.text }}>
                    {data.sleep || '0H'}
                  </span>
                </div>
              </div>
            </div>

            {/* 메시지 박스 + 닉네임 + 날짜 전체 영역 */}
            <div className="message-name-section" data-testid="message-section">
              {/* 메인 텍스트 박스 (꺽쇠 포함) */}
              <div className="message-box-wrapper" data-testid="message-box">
                {/* 메시지 내용 */}
                <div 
                  className="message-content"
                  data-testid="message-content"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: `4px solid ${theme.border}`,
                    minHeight: '92px'
                  }}
                >
                  {/* 왼쪽 꺽쇠 (텍스트 박스 안에) */}
                  <Image 
                    src={getThemedIcon('bracket-left')}
                    alt=""
                    width={10}
                    height={10}
                    className="bracket-left"
                    data-testid="bracket-left"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <p className="message-text" data-testid="message-text" style={{ color: theme.text }}>
                    {data.mainText || '오늘도 화이팅! 💪'}
                  </p>
                  {/* 오른쪽 꺽쇠 (텍스트 박스 안에) */}
                  <Image 
                    src={getThemedIcon('bracket-right')}
                    alt=""
                    width={10}
                    height={10}
                    className="bracket-right"
                    data-testid="bracket-right"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </div>
              
              {/* 닉네임 */}
              <div className="name-wrapper" data-testid="name-wrapper">
                <div 
                  className="name-badge"
                  data-testid="name-badge"
                  style={{ 
                    backgroundColor: theme.accent,
                  }}
                >
                  {data.name || 'som'}
                </div>
              </div>
              
              {/* 하트 아이콘 */}
              <div className="hearts-wrapper" data-testid="hearts-wrapper">
                <div className="hearts-group" data-testid="hearts">
                  <Image 
                    src="/images/hearts.png"
                    alt="hearts"
                    width={32}
                    height={16}
                    data-testid="hearts"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </div>
              
              {/* 날짜 표시 */}
              <div className="date-display" data-testid="date">
                <span className="date-text" data-testid="date-text" style={{ color: theme.text }}>
                  {currentDate}
                </span>
              </div>
            </div>

            {/* 새로고침 버튼 (숨김) */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (config) fetchData(config)
              }}
              className="refresh-button"
              style={{ 
                backgroundColor: theme.accent,
                color: 'white'
              }}
            >
              🔄
            </button>
          </>
        ) : null}
        </div>
      </div>
    </div>
  )
}

export default function WidgetPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#FFCEE4',
        fontSize: '24px'
      }}>
        ⏳ 위젯 로딩 중...
      </div>
    }>
      <WidgetContent />
    </Suspense>
  )
}


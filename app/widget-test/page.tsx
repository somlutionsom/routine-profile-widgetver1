export default function WidgetTest() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FFCEE4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'  // 기본 폰트 사용
    }}>
      <div>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <div>모바일 노션 앱 테스트</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>
          이 메시지가 보이면<br/>JavaScript 로딩 성공!
        </div>
        <div style={{ fontSize: '12px', marginTop: '16px', color: '#666' }}>
          복잡한 라이브러리 없이<br/>순수 HTML/CSS만 사용
        </div>
      </div>
    </div>
  )
}

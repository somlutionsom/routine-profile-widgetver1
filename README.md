# 🎮 Notion Pixel Widget

Notion 데이터베이스와 실시간 연동되는 픽셀 아트 스타일의 개인 프로필 위젯 서비스

## 📌 저장소 정보

- **프로젝트 유형**: 웹앱 (Next.js 15)
- **데모**: [여기에 배포 URL 추가 예정]
- **GitHub**: [여기에 저장소 URL 추가 예정]

## ✨ 주요 기능

- 🔗 **Notion API 연동**: Notion 데이터베이스와 실시간 동기화
- 🎨 **5가지 테마**: 핑크, 퍼플, 블루, 그린, 모노크롬 테마 지원
- 🖼️ **픽셀 아트 스타일**: 레트로 감성의 귀여운 UI
- ⚡ **실시간 업데이트**: 2분마다 자동 데이터 갱신
- 📱 **Notion 임베드**: Notion 페이지에 직접 임베드 가능
- 🔐 **보안**: AES-256 암호화로 API 토큰 보호

## 🚀 설치 및 실행

### 1. 저장소 클론

```bash
git clone [저장소 URL]
cd routine-profile-ver1
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_ENCRYPTION_KEY=your-super-secret-encryption-key-must-be-32-chars!
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **중요**: `ENCRYPTION_KEY`는 반드시 32자 이상이어야 합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🔧 Notion Integration 설정

### 1. Integration 생성

1. [notion.so/my-integrations](https://www.notion.so/my-integrations) 접속
2. "새 Integration 만들기" 클릭
3. Integration 이름 입력 (예: "Pixel Widget")
4. **권한 설정**: "Read content" 체크
5. "제출" 클릭
6. **Secret 토큰 복사** (ntn_로 시작)

### 2. 데이터베이스 공유

1. 사용할 Notion 데이터베이스 페이지 열기
2. 우측 상단 "..." → "연결" → 생성한 Integration 선택
3. "초대" 클릭

### 3. 필수 데이터베이스 속성

데이터베이스에 다음 속성이 필요합니다:

| 속성 이름 | 타입 | 설명 |
|---------|------|------|
| `Date` | Date | 날짜 (필터링에 사용) |
| `profile image` | Files & media | 프로필 이미지 |
| `sleep` | Formula | 수면 시간 (예: "8H") |
| `energy` | Number | 에너지 레벨 (0-5) |
| `name` | Text | 이름 |
| `main text` | Text | 상태 메시지 |

## 📖 사용 방법

### 1. 온보딩 플로우

1. **Step 1**: Notion Integration 토큰 입력
2. **Step 2**: 데이터베이스 선택 및 테마 커스터마이징
3. **Step 3**: 생성된 위젯 URL 복사

### 2. Notion에 임베드하기

1. Notion 페이지에서 `/embed` 입력
2. 생성된 위젯 URL 붙여넣기
3. 크기 조정 (권장: 350×450px)

### 3. 위젯 기능

- **테마 변경**: 위젯 클릭 시 테마 순환
- **수동 새로고침**: 새로고침 버튼 클릭
- **자동 새로고침**: 2분마다 자동 데이터 갱신

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, 픽셀 폰트 (NeoDonggeunmo, DotGothic16)
- **API**: Notion API (@notionhq/client)
- **암호화**: crypto-js (AES-256)
- **배포**: Vercel

## 📁 프로젝트 구조

```
routine-profile-ver1/
├── app/
│   ├── api/
│   │   └── notion/
│   │       ├── databases/route.ts       # DB 목록 조회 API
│   │       └── widget-data/route.ts     # 위젯 데이터 조회 API
│   ├── components/
│   │   ├── OnboardingFlow.tsx           # 온보딩 컴포넌트
│   │   └── WidgetPreview.tsx            # 미리보기 컴포넌트
│   ├── widget/
│   │   └── page.tsx                     # 위젯 페이지
│   ├── globals.css                      # 글로벌 스타일
│   ├── layout.tsx                       # 루트 레이아웃
│   └── page.tsx                         # 메인 페이지
├── lib/
│   └── utils.ts                         # 유틸리티 함수
├── public/
│   └── images/                          # 이미지 리소스
├── next.config.js                       # Next.js 설정
├── tailwind.config.js                   # Tailwind 설정
└── package.json
```

## 🚢 배포 (Vercel)

### 1. Vercel 프로젝트 생성

```bash
npm install -g vercel
vercel
```

### 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수 추가:

- `NEXT_PUBLIC_ENCRYPTION_KEY`: 32자 이상의 랜덤 문자열
- `NEXT_PUBLIC_APP_URL`: 배포된 도메인 (예: https://your-widget.vercel.app)

### 3. 배포

```bash
vercel --prod
```

## 🔒 보안

- API 토큰은 AES-256으로 암호화되어 URL에 포함됩니다
- 서버사이드에서만 토큰이 복호화됩니다
- HTTPS 필수 (Vercel 자동 적용)
- iframe 임베드를 위한 CSP 헤더 설정 완료

## 📝 라이선스

MIT License

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

## 📧 문의

문제가 발생하면 GitHub Issues에 등록해주세요.
# Updated Thu Oct 16 20:27:21 KST 2025

# FITCORE — Antigravity + Claude 통합 설정

## ⚡ 응답 규칙 (토큰 절약 — 반드시 준수)
- 모든 응답은 **한국어**로
- 설명 최소화 → **코드만** 제공
- 변경된 부분만 출력 (전체 파일 출력 금지)
- 확인 질문 없이 **바로 실행**
- 주석은 핵심만, 한 줄로
- 오류 시 원인 한 줄 + 수정 코드만 제시

---

## 🏗️ 프로젝트 개요
- **서비스**: FITCORE — 운동·식단·체성분 통합 AI 헬스코치 SaaS
- **도메인**: fitcore.co.kr / admin.fitcore.co.kr
- **앱**: com.fitcore.app

## 📁 실제 코드 위치
```
C:\Users\LG\.gemini\antigravity\scratch\my-saas-project\
├── apps/web        → Next.js 14 (fitcore.co.kr)
├── apps/mobile     → React Native + Expo
├── apps/admin      → Next.js Admin
├── packages/ui     → 공통 컴포넌트 ⛔수정금지
├── packages/i18n   → 한/영 번역 ⛔수정금지
└── supabase/       → DB 마이그레이션
```

---

## 🛠️ 기술 스택
| 영역 | 기술 |
|------|------|
| 프론트 | Next.js 14 App Router, TypeScript, Tailwind, Framer Motion |
| 모바일 | React Native + Expo Router, EAS Build |
| 백엔드 | Supabase (PostgreSQL + Auth + Storage) |
| AI | Gemini Flash(일 1500회) / Pro(일 50회) |
| 결제 | Stripe |
| 배포 | Vercel 서울 리전 icn1 |
| 모노레포 | Turborepo + pnpm |

## 🎨 디자인 시스템
- 메인: Neon Green `#39FF14` (CTA), Dark Navy `#1A1A2E` (배경)
- 폰트: Inter (웹), System Font (모바일)
- 다크/라이트 모드 지원

---

## ⛔ 절대 수정 금지 파일
```
packages/ui/tokens/          → 디자인 토큰
packages/ui/components/      → Button/Input/Card/Toast/Modal
packages/i18n/               → translate.ts, LanguageSelector.tsx
apps/web/lib/gemini.ts       → callGemini 함수
```

---

## 🤖 AI 모델 선택 기준
| 상황 | 모델 | 이유 |
|------|------|------|
| 일반 코드 수정, 버그픽스 | Gemini 3 Flash | 빠름, 할당량 많음 |
| 복잡한 로직, 아키텍처 | Claude Sonnet 4.6 | 긴 컨텍스트, 정확도 |
| UI 화면 생성 | Stitch MCP | 디자인 특화 |
| DB 스키마, 보안 | Claude Opus 4.6 | 정밀도 최우선 |
| 429 오류 발생 시 | Flash → Flash-8B 순서로 변경 | 할당량 초과 대응 |

## Gemini 모델 설정
- Flash: `gemini-2.0-flash`
- Pro: `gemini-2.0-pro-exp`

---

## ✅ 완료된 STEP (건드리지 않음)
STEP 40(SEO), 41(Vercel), 42(앱빌드), 43(PROGRESS.md), AI1(Gemini연동), AI2(AI품질)

## 🎯 현재 작업 순서
```
STEP 44 → Supabase DB 연동
STEP 45 → 랜딩페이지
STEP 46 → 대시보드
STEP 47 → Stripe 결제
STEP 48 → 모바일
STEP 49 → Admin
STEP 50 → QA
```
> 상세 현황: `C:\Users\LG\.gemini\antigravity\scratch\my-saas-project\PROGRESS.md`

---

## 🔧 MCP 서버 연동 현황
- **Supabase MCP**: DB 직접 조작 가능
- **GitHub MCP**: 자동 커밋/푸시
- **Stitch MCP**: UI 화면 자동 생성

## 📐 Skills 파일 위치 (@멘션 사용법)
```
@CLAUDE.md          → 전체 프로젝트 컨텍스트
@schema.sql         → DB 구조 참조
@PROGRESS.md        → 진행 현황 참조
@gemini.ts          → AI 연동 함수 참조
@packages/ui/       → 공통 컴포넌트 확인 (수정 X)
```

---

## 💡 작업 시작 전 체크리스트
작업 요청 시 아래 순서로 진행:
1. PROGRESS.md 확인 → 현재 STEP 파악
2. 수정 금지 파일 여부 확인
3. Fast 모드(빠른 수정) vs Plan 모드(복잡한 기능) 판단
4. Gemini Flash 우선 → 복잡도 높으면 Claude 전환
5. 완료 후 PROGRESS.md 업데이트

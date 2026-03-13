# FITCORE 프로젝트 — Claude Code 설정

## 프로젝트 개요
- **서비스**: 핏코어 (FITCORE) — 운동·식단·체성분 통합 AI 헬스코치 SaaS
- **도메인**: fitcore.co.kr / admin.fitcore.co.kr
- **앱**: com.fitcore.app (핏코어 - AI 헬스 코치)

## 실제 코드 위치
```
C:\Users\LG\.gemini\antigravity\scratch\my-saas-project\
├── apps/web        → Next.js 14 (fitcore.co.kr)
├── apps/mobile     → React Native + Expo (com.fitcore.app)
├── apps/admin      → Next.js Admin (admin.fitcore.co.kr)
├── packages/ui     → 공통 컴포넌트 (수정 금지)
├── packages/i18n   → 한/영 번역 (수정 금지)
└── supabase/       → DB 마이그레이션
```
> 이 디렉토리(fitcore-webpage)는 작업 기준점. 실제 파일은 위 경로에 있음.

## 기술 스택
- **프론트**: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion
- **모바일**: React Native + Expo Router, EAS Build
- **백엔드**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Google Gemini API (Flash: 하루 1,500회 / Pro: 50회)
- **결제**: Stripe
- **배포**: Vercel (서울 리전 icn1)
- **모노레포**: Turborepo + pnpm

## 디자인 시스템
- **메인 색상**: Neon Green `#39FF14` (CTA), Dark Navy `#1A1A2E` (배경)
- **폰트**: Inter (웹), System Font (모바일)
- **테마**: 다크/라이트 모드 지원

## 재사용 고정 파일 (절대 수정 금지)
- `packages/ui/tokens/` — 디자인 토큰 전체
- `packages/ui/components/` — Button/Input/Card/Toast/Modal
- `packages/i18n/` — translate.ts, LanguageSelector.tsx
- `apps/web/lib/gemini.ts` — callGemini 함수

## Gemini 모델 설정
- Flash: `gemini-2.0-flash` (빠름, 할당량 많음)
- Pro: `gemini-2.0-pro-exp` (고품질, 할당량 적음)
- 429 오류 시: Flash → Flash-8B 순서로 변경

## 완료된 STEP (건드리지 않음)
STEP 40(SEO), 41(Vercel), 42(앱빌드), 43(PROGRESS.md), AI1(Gemini연동), AI2(AI품질)

## 다음 작업 순서
STEP 44(Supabase) → 45(랜딩페이지) → 46(대시보드) → 47(Stripe) → 48(모바일) → 49(Admin) → 50(QA)

## 진행 현황
`C:\Users\LG\.gemini\antigravity\scratch\my-saas-project\PROGRESS.md` 참조

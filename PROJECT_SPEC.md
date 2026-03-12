# FITCORE 핵심 기획 명세서 (PROJECT_SPEC.md)

## 🎯 서비스 소개
- **서비스명:** 핏코어 (FITCORE)
- **정체성:** 대한민국 No.1 헬스 앱들의 장점만 집약한 **데이터-드리븐 AI 헬스코치 통합 SaaS**
- **벤치마킹 타겟:**
  1. **인바디 (InBody):** 정밀한 체성분 데이터 시각화 및 변화 분석
  2. **플릭 (Flick):** 직관적이고 끊김 없는 운동 세트 기록 UX
  3. **필라이즈 (Pillyze):** AI 기반 초개인화 영양 컨설팅 및 식단 가이드
- **비전:** "측정에서 코칭까지, 데이터로 증명하는 당신의 변화"

## 🚀 개발 로드맵: 안티그래비티 S-프레임워크 (S0 ~ S7)

- **[S0] 브랜드 아이덴티티:** Premium Dark Theme (Navy #1A1A2E + Neon Green #39FF14), 모던하고 에너제틱한 UI/UX
- **[S1] 기술 스택:** Next.js 14 (App Router), Supabase (PostgreSQL, Auth, Storage), Tailwind CSS, Framer Motion, TanStack Query, Zustand
- **[S2] DB & Auth (완료):** 물리적 DB 스키마 완료, 이메일 인증 우회 세팅 완료 (범수 부장 직접 조치)
- **[S3] 공통 UI (완료):** 디자인 토큰이 적용된 Button, Card, Input 컴포넌트 (`/ui-test` 반영)
- **[S4] 대시보드 연동 (완료):** 실시간 데이터 패칭 기반 메인 대시보드 구축
- **[S5] 코어 서비스 구현 (진행중):** 
  - **Phase A:** 인바디 기록/관리 (InBody UX)
  - **Phase B:** 부위별 운동 기록 시스템 (Flick UX)
  - **Phase C:** AI 식단/영양 분석 서비스 (Pillyze UX)
- **[S6] 고도화 & 수익화:** 구독 결제(Toss/PayPal), AI 체형 분석(Vision API)
- **[S7] 최적화 & 런칭:** SEO, 성능 최적화, Vercel 배포

## 💎 Killer Features (차별화 포인트)
1. **InBody Logic:** 단순 수치 나열이 아닌, 표준 범위를 시각적으로 보여주는 '게이지 바' 방식 채택.
2. **Flick Record:** 운동 중 장갑을 껴도 누르기 쉬운 큼직한 버튼과 세트 자동 완성 기능.
3. **Pillyze AI Coaching:** 기록된 데이터를 바탕으로 AI가 "오늘은 단백질 15g이 더 필요합니다"라고 먼저 제안.

## ⚠️ 개발 원칙 (개발팀 수칙)
1. **Zero Dummy Policy:** 모든 UI는 실제 DB와 연결되어야 한다.
2. **Design First:** 소희 디자이너의 가이드를 100% 준수한다.
3. **Weekly Sprints:** 매주 새로운 핵심 기능을 `ui-test`에 업데이트하여 대표님의 검토를 받는다.

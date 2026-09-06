# life — 개인 삶 통합 관리 사이트

React(Vite) + Supabase 기반의 개인용 라이프 관리 웹앱입니다. GitHub 저장소 `myeolgu/life`에 연결되어 있고 GitHub Pages로 배포됩니다. 검색엔진에는 노출하지 않는 비공개 성격의 개인 사이트입니다. PWA로도 동작해서 (매니페스트 + 서비스워커) 휴대폰/데스크탑에 앱처럼 설치할 수 있다.

관리 대상은 인테리어 하나로 한정되지 않고, 삶 전반의 여러 도메인을 다룹니다. 현재 도메인:
- **인테리어** — 부개주공1단지 아파트 107동 1001호(인천광역시 부평구 부개동, 25평/전용 약 59㎡) 인테리어 준비 (매물정보/시공범위/공사순서/계약견적 체크리스트)
- **디딤돌 대출/계약** — 혼인신고, 신혼부부 디딤돌대출 신청 진행 상황과 자금 계획
- **예산 관리** — 지출/예산 추적 (구축 예정)

새 도메인(재정, 건강, 일정 등)이 추가될 수 있으므로, 구조를 짤 때 특정 도메인에 종속되지 않게 일반화해서 만든다.

## 데이터 저장 — Supabase
**콘텐츠는 예외 없이 전부 Supabase DB에서 관리한다** (2026-09-06, 사용자가 명시적으로 요청 — "데이터 관련은 다 supabase에서 관리"). 체크박스뿐 아니라 매물 정보, 시공 범위 표, 캘린더 일정, 계약 체크리스트 카드, 대출 요약까지 전부 Supabase 테이블에서 읽어온다. `src/domains/<도메인>/data.js`의 값들은 이제 "정적 콘텐츠"가 아니라 **최초 1회용 시드 데이터**일 뿐이다 — 테이블에 해당 도메인/섹션 행이 하나도 없을 때만 훅이 이 시드를 Supabase에 upsert하고, 그 다음부터는 항상 DB 값을 읽는다. 새 콘텐츠를 추가할 때도 이 패턴(시드 배열 + 훅)을 그대로 따른다. 클라이언트 코드는 `src/lib/supabaseClient.js`에서 환경변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)로 초기화한다. 이 값들은 `.env`(gitignore 처리, 로컬 개발용)와 GitHub Actions 저장소 시크릿(배포 빌드용)에 있고 절대 코드에 하드코딩하거나 커밋하지 않는다.

Supabase 테이블 스키마나 RLS 정책을 바꿀 때는 실제 실행한 SQL을 기록해두고, 이 파일이나 관련 skill 문서에 반영한다 (Claude는 Supabase 대시보드에 직접 접근할 수 없으므로, 스키마 변경은 사용자가 SQL 에디터에서 실행해야 함).

## 이 저장소의 구조
- `src/App.jsx` — 최상위 라우터. `view` 상태(`home`/`interior`/`loan`/...)로 홈 화면과 각 도메인 페이지를 전환한다. 새 도메인을 추가하면 여기에 분기를 추가.
- `src/Home.jsx` — 홈 화면. 카테고리 카드(인테리어, 대출...)를 눌러 도메인으로 진입하고, 하단에 `HomeCalendar`로 전체 도메인 일정을 모아 보여준다.
- `src/allEvents.js` — 각 도메인의 `events` 배열을 모아 홈 캘린더에서 쓰는 통합 목록. 새 도메인에 날짜 있는 일정이 생기면 여기 `domainMeta`에 색상/이름을 등록하고 `allEvents`에 합쳐준다.
- `src/components/` — 도메인에 종속되지 않는 공용 컴포넌트. `EventStatusBadge`(종료/진행중/예정 배지, 오늘 날짜 기준 자동 계산), `HomeCalendar`(홈 화면 통합 캘린더 — 이벤트 색은 도메인이 아니라 **상태(종료/진행중/예정) 기준**이고, 도메인 구분은 작은 점만 씀), `AddEventForm`(캘린더 "+ 일정 추가" 버튼으로 여는 일정 추가 폼), `Modal`(팝업 — 캘린더 일정 상세/추가 폼 등에 사용), `ErrorBoundary`(탭/섹션 단위 에러 격리 — 하나가 깨져도 앱 전체가 하얗게 안 되게 함. 새 탭/섹션을 추가할 때는 항상 이걸로 감싼다).
- `src/domains/<도메인>/` — 도메인별 폴더. 각 도메인은 `data.js`(콘텐츠/체크리스트 시드 데이터)와 `<Domain>Page.jsx`(그 도메인 안의 탭/섹션 UI)로 구성된다.
  - `src/domains/interior/` — 인테리어 도메인 (매물정보/시공범위/공사순서(캘린더)/계약체크리스트/진행상황)
  - `src/domains/loan/` — 대출/혼인신고 도메인 (자금계획/진행상황)
  - 새 도메인을 추가할 때는 이 패턴을 그대로 따라 `src/domains/<새도메인>/` 폴더를 만들고, `Home.jsx`의 카테고리 목록과 `App.jsx`의 라우팅에 추가한다.
- `src/hooks/` — Supabase와 동기화하는 공용 훅 3종. 전부 "테이블에 행이 없으면 시드 upsert, 있으면 DB 값 사용" 패턴이다.
  - `useChecklist.js` — 체크박스 목록 (`checklist_items` 테이블). 도메인마다 다른 `domain` 문자열 키로 구분: `interior_progress`, `loan_progress`, `loan_documents` 등.
  - `useContentItems(domain, section, seedItems)` — 체크박스가 아닌 표/카드/텍스트 목록 (`content_items` 테이블). 각 항목을 JSONB로 그대로 저장해서 형태가 자유롭다 (매물 정보 한 덩어리, 시공 범위 표 행, 카드 목록 등 전부 이걸로 관리).
  - `useCalendarEvents(domain, seedEvents)` — 날짜 있는 일정 (`calendar_events` 테이블). FullCalendar 이벤트 형식(`id/title/start/end/description`)을 그대로 주고받는다.
- `src/lib/supabaseClient.js` — Supabase 클라이언트 초기화.
- `index.html` — `<meta name="robots" content="noindex, nofollow">`로 검색엔진 노출 차단, Pretendard 폰트 CDN 로드.
- `public/robots.txt` — 전체 크롤링 차단 (`Disallow: /`).
- `.github/workflows/deploy.yml` — main 브랜치 push 시 GitHub Pages 자동 배포 (Supabase 환경변수를 빌드 시 주입).
- `vite.config.js` — `base: '/life/'` (GitHub Pages 저장소 경로와 일치, 저장소명이 바뀌면 같이 수정) + `VitePWA` 플러그인 설정(매니페스트, 아이콘, 서비스워커).
- `src/assets/icon-source.svg` — 앱 아이콘 원본 (16x16 그리드 픽셀아트 집 모양, `shape-rendering="crispEdges"`). `public/favicon.svg`와 `public/icons/`의 PNG(192/512/마스커블 512)는 전부 이 파일에서 만든 결과물이라, 아이콘을 바꾸려면 이 SVG를 고치고 다시 렌더링해야 한다 (PNG는 `sharp`로 `kernel: 'nearest'` 리사이즈해야 픽셀 경계가 흐려지지 않는다 — 작업 끝나면 `sharp`는 다시 제거). 사이트 컨셉이 "살짝 픽셀아트 느낌"이라 이 아이콘의 16그리드/저채도 팔레트 톤을 다른 UI 요소(뱃지, 카드 등)에도 참고할 것.
- `.claude/agents/interior-design-assistant.md` — 인테리어 도메인 전담 서브에이전트. 다른 도메인(예산, 계약 검토 등)이 구체화되면 같은 방식으로 도메인별 에이전트를 추가한다.
- `.claude/skills/interior-notion-project/SKILL.md` — (완전 레거시) 예전에 Notion으로 관리하던 시절의 페이지 구조 기록. Notion은 더 이상 사용하지 않으며, 과거 정리 내용을 참고만 할 때 남겨둠.

## Supabase 테이블: checklist_items
체크박스 계열 데이터는 전부 이 하나의 테이블에서 `domain` 컬럼으로 구분해서 관리한다 (도메인별로 테이블을 새로 만들지 않는다).

```sql
create table checklist_items (
  id text primary key,
  domain text not null,
  label text not null,
  done boolean not null default false,
  group_label text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

alter table checklist_items enable row level security;

create policy "anon read" on checklist_items for select to anon, authenticated using (true);
create policy "anon write" on checklist_items for insert to anon, authenticated with check (true);
create policy "anon update" on checklist_items for update to anon, authenticated using (true) with check (true);
create policy "anon delete" on checklist_items for delete to anon, authenticated using (true);
```
`to anon, authenticated`를 꼭 명시할 것 — 역할을 안 적으면(기본 PUBLIC) 실제로는 insert가 RLS에 막히는 걸 2026-09-06에 겪었다. 사용자가 로그인 없이 anon key로만 접근하는 개인용 사이트라서 RLS를 전체 허용으로 열어둔 것 — 인증을 붙이기 전까지는 유지한다. 앱이 처음 로드될 때 `useChecklist`가 각 도메인의 시드 데이터를 자동으로 upsert하므로, 테이블만 만들어두면 항목은 앱이 채운다.

`group_label`은 선택 필드다 — 체크리스트 항목을 화면에서 소그룹으로 묶어 보여줘야 할 때 쓴다 (예: 디딤돌대출 필요서류를 "공통"/"남편"/"아내"로 나눠서 보여줌, `LoanPage.jsx`의 `groupItems` 참고). 그룹이 필요 없는 체크리스트는 그냥 `null`로 둔다.

## Supabase 테이블: content_items, calendar_events
체크박스가 아닌 나머지 콘텐츠(매물정보/시공범위/계약체크리스트/자금계획 요약 등)와 캘린더 일정도 각각 이 두 테이블에서 관리한다. 둘 다 `checklist_items`와 같은 RLS 정책 구조(`to anon, authenticated`로 select/insert/update/delete 전체 허용)를 쓴다.

```sql
create table content_items (
  id text primary key,
  domain text not null,
  section text not null,
  data jsonb not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table calendar_events (
  id text primary key,
  domain text not null,
  title text not null,
  start_date date not null,
  end_date date,
  description text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
```
- `content_items.data`는 JSONB라 형태가 자유롭다: `section='property'`면 매물 정보 객체 하나를 통째로, `section='scope'`면 시공 범위 표의 각 행을 하나씩, `section='contract_checklist'`면 카드 하나씩 저장한다. `(domain, section)` 조합으로 어떤 화면의 어떤 콘텐츠인지 구분한다.
- `calendar_events`는 FullCalendar 이벤트 형식 그대로 컬럼화했다 (`start_date`/`end_date`가 FullCalendar의 `start`/`end`에 대응, `end_date`는 "포함하지 않는" 다음 날짜).

## 일정/캘린더 데이터
날짜가 있는 진행 일정(공사 순서 등)은 표가 아니라 `@fullcalendar/react`(dayGrid + interaction 플러그인)로 실제 달력 뷰로 보여준다. 날짜를 클릭하면 상세 설명이 모달 팝업으로 나온다 (`src/components/Modal.jsx`, `InteriorPage.jsx`의 `Timeline` 컴포넌트 참고).

이벤트 시드 데이터 형식 (`src/domains/<도메인>/data.js`의 `events` 배열 — `useCalendarEvents`의 초기값으로만 쓰임):
```js
{ id: "d1", title: "철거", start: "2026-12-12", end: "2026-12-15", description: "욕실 철거, 폐기물 반출 등 상세 내용" }
```
- `end`는 FullCalendar 규칙대로 "포함하지 않는" 다음 날짜다. 하루짜리 일정이면 `end`를 아예 생략한다.
- `title`은 달력 칸에 들어갈 짧은 이름, `description`은 클릭했을 때 보여줄 전체 설명.
- 홈 화면 통합 캘린더(`src/allEvents.js`의 `useAllEvents`)는 각 도메인의 `useCalendarEvents` 결과를 합쳐서 보여준다 — 새 도메인에 일정이 생기면 여기에도 추가한다. **일정 색상은 도메인이 아니라 상태(`getEventStatus`) 기준**으로 칠한다 — 도메인은 작은 점(`legend-dot`)으로만 구분한다 (한 달에 한 도메인 일정만 있으면 전부 같은 색으로 보여서 헷갈린다는 피드백을 받아 2026-09-06에 고침). `useAllEvents`가 돌려주는 `addEvent(domain, event)`로 캘린더 헤더의 "+ 일정 추가" 커스텀 버튼(`customButtons`, `AddEventForm` 모달)에서 새 일정을 바로 추가할 수 있다 — 폼의 "종료일"은 사용자에게는 포함(inclusive)으로 보여주고, 저장 직전에 FullCalendar 규칙(미포함 다음날)으로 변환한다(`toExclusiveEnd`).
- **FullCalendar 패키지는 버전을 반드시 통일할 것.** `@fullcalendar/react`만 v7로 먼저 올라가고 `core`/`daygrid`/`interaction`은 아직 v6가 `latest`인 시기가 있어서(2026-09-06 기준), `npm install @fullcalendar/react @fullcalendar/core ...`를 버전 지정 없이 실행하면 서로 다른 메이저 버전이 섞여 설치되어 캘린더가 마운트 중 조용히 깨지고(에러 로그도 없이) 해당 탭이 빈 화면으로 보인다. `package.json`에 네 패키지 모두 정확히 같은 버전(현재 `6.1.21`)으로 고정되어 있다 — 업그레이드할 땐 네 패키지를 항상 같이, 같은 버전으로 올린다.
- 일정 상태(종료/진행중/예정) 배지는 `src/components/EventStatusBadge.jsx`의 공용 컴포넌트로 관리한다. 오늘 날짜와 이벤트의 start/end를 비교해 상태를 자동 계산하므로(`getEventStatus`), 도메인 쪽에서 상태를 직접 하드코딩하지 않는다. 색상/라벨 체계는 Figma "삼성물산 시니어 리빙 솔루션 리빙매니저" 캘린더 컴포넌트(BadgeCalendar24)를 참고함 — 종료 #888, 진행중 #7b53ea, 예정 #ff863b.

## Supabase 스키마 변경 자동화 — Management API
스키마(테이블/정책 등)를 바꿔야 할 때, 매번 사용자에게 SQL Editor에서 직접 실행해달라고 부탁할 필요 없다. `.env`(gitignore 처리, 커밋 안 됨)에 `SUPABASE_PROJECT_REF`와 `SUPABASE_MANAGEMENT_TOKEN`이 들어있으면, 아래처럼 Management API로 Claude가 직접 SQL을 실행할 수 있다:

```bash
curl -s -X POST "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF/database/query" \
  -H "Authorization: Bearer $SUPABASE_MANAGEMENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"<실행할 SQL>"}'
```

- `SUPABASE_MANAGEMENT_TOKEN`은 프로젝트를 통째로 제어하는 강력한 토큰이다. **VITE_ 접두사를 붙이지 말 것** — 붙이면 Vite가 클라이언트 번들에 그대로 노출시켜버린다. 절대 앱 코드/커밋에 넣지 않는다.
- `.env`가 없거나 이 값들이 비어있으면, 사용자에게 https://supabase.com/dashboard/account/tokens 에서 토큰 발급을 요청한다 (Access Tokens → Generate new token, 생성 직후 한 번만 전체 값이 보이므로 그 자리에서 바로 복사해야 함).
- DB 비밀번호(사용자가 프로젝트 생성 시 설정한 것)로 직접 Postgres 접속(`db.<ref>.supabase.co:5432`)은 이 환경에서 DNS 자체가 안 잡혀서 실패했다 (IPv6 전용으로 추정) — Management API 방식이 더 안정적이니 이걸 기본으로 쓴다.
- **한글이 포함된 SQL을 curl로 보낼 때는 `-d '{"query":"..."}'`처럼 커맨드라인에 직접 넣지 말 것.** 쉘 따옴표 처리 과정에서 인코딩이 깨져 한글이 mojibake로 저장된다 (2026-09-06에 겪음). 대신 UTF-8로 JSON 파일을 써서 `--data-binary "@파일경로"`로 보낸다.
- 앱이 이미 방문된 적이 있으면 `checklist_items`에 도메인별 시드 데이터가 이미 들어가 있다. `data.js`의 `progress`/`documents` 등 시드 배열을 고쳐도 **DB에 있는 기존 행은 자동으로 갱신되지 않는다** (`useChecklist`는 행이 하나도 없을 때만 시드를 넣는다) — 라벨/완료 상태를 바꿨으면 Management API로 해당 `id`의 기존 행도 같이 `update`해줘야 화면에 반영된다.

## Windows 로컬 빌드 관련 알려진 이슈
이 저장소 경로(`C:\workspace\인테리어`)에 한글이 포함되어 있는데, 이 환경에서는 `npm run build`(Vite/esbuild)가 "rendering chunks" 단계 직전에 exit code 127로 결정적으로 실패한다 (`npm run dev`는 정상 동작). 원인은 로컬 esbuild 서브프로세스가 비-ASCII 경로를 다루는 방식의 문제로 추정되며, Vite 5/8 양쪽에서 재현됨. 같은 코드를 ASCII 경로에 복사하면 정상 빌드된다. GitHub Actions(Linux, ASCII 경로)에서는 문제없이 빌드되므로 배포 자체는 영향 없음 — 로컬에서 프로덕션 빌드를 직접 확인해야 할 때만 이슈가 된다. 근본 해결책은 작업 폴더를 ASCII 경로(예: `C:\workspace\life`)로 옮기는 것.

## 작업 원칙
- 콘텐츠/상태 변경은 항상 Supabase 테이블을 갱신하는 방식으로 한다 (Notion 페이지는 더 이상 갱신하지 않음). 새 화면/데이터를 추가할 때 `data.js`에만 넣고 끝내지 말 것 — 반드시 `useContentItems`/`useCalendarEvents`/`useChecklist` 중 맞는 훅으로 감싸서 Supabase에도 반영되게 한다.
- 대출/정책 관련 정보(디딤돌대출 조건 등)는 시점에 따라 바뀌므로, 참고할 때마다 최신 여부를 재검색해서 확인한다.
- 폰트는 Pretendard로 전역 통일 (`index.html`의 CDN 링크 + `src/index.css`의 font-family).
- 이 사이트는 검색 노출을 원치 않는 개인 프로젝트이므로 noindex/robots.txt 설정을 절대 제거하지 않는다.
- git add/commit/push은 사용자에게 확인받지 않고 바로 진행한다 (사용자가 명시적으로 요청함, 2026-09-06). **의미 있는 변경 단위마다 바로바로 커밋/푸시할 것** — 여러 파일을 고치는 큰 작업이라도 하나의 기능/수정이 끝날 때마다 커밋하고, 대화가 끝나거나 다음 요청으로 넘어갈 때까지 커밋을 미루지 않는다 (2026-09-06, 커밋을 몰아서 한다고 사용자에게 지적받음). 단, force push나 히스토리를 되돌리는 명령(reset --hard, 강제 push 등)처럼 되돌리기 어려운 작업은 예외로 하고 여전히 확인을 구한다.
- Supabase anon key는 클라이언트에 노출되는 게 정상이지만, 이 사이트는 인증 없이 anon key만으로 읽기/쓰기가 가능한 상태라 URL을 아는 사람은 누구나 데이터를 보고 고칠 수 있다. 민감한 정보(주민번호, 계좌번호 등 원문)는 절대 테이블에 넣지 않는다.

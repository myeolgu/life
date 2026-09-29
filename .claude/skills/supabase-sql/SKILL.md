---
name: supabase-sql
description: Supabase에 SQL을 직접 실행해야 할 때(테이블/RLS 스키마 변경, data.js 시드 수정 후 DB 행 동기화) Management API로 실행하는 방법과 현재 테이블 스키마.
---

# Supabase SQL 실행 — Management API

스키마(테이블/정책 등)를 바꾸거나 DB 행을 맞춰야 할 때, 사용자에게 SQL Editor 실행을 부탁할 필요 없다. `.env`(gitignore 처리, 커밋 안 됨)에 `SUPABASE_PROJECT_REF`와 `SUPABASE_MANAGEMENT_TOKEN`이 들어있으면 Claude가 직접 실행한다:

```bash
curl -s -X POST "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF/database/query" \
  -H "Authorization: Bearer $SUPABASE_MANAGEMENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"<실행할 SQL>"}'
```

- `.env`가 없거나 이 값들이 비어있으면, 사용자에게 https://supabase.com/dashboard/account/tokens 에서 토큰 발급을 요청한다 (Access Tokens → Generate new token, 생성 직후 한 번만 전체 값이 보이므로 그 자리에서 바로 복사해야 함).
- DB 비밀번호로 직접 Postgres 접속(`db.<ref>.supabase.co:5432`)은 이 환경에서 DNS 자체가 안 잡혀서 실패했다 (IPv6 전용으로 추정) — Management API 방식을 기본으로 쓴다.
- **한글이 포함된 SQL을 curl로 보낼 때는 `-d '{"query":"..."}'`처럼 커맨드라인에 직접 넣지 말 것.** 쉘 따옴표 처리 과정에서 인코딩이 깨져 한글이 mojibake로 저장된다 (2026-09-06에 겪음). 대신 UTF-8로 JSON 파일을 써서 `--data-binary "@파일경로"`로 보낸다.
- 반영한 뒤에는 `select`로 다시 읽어서 의도한 값과 일치하는지 확인한다.

## 현재 테이블 스키마

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
`content_items`, `calendar_events`도 `checklist_items`와 같은 RLS 정책 4종(`to anon, authenticated`)을 쓴다. 스키마를 바꾸면 실행한 SQL을 이 파일에 반영한다.

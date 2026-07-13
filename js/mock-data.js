/* 취업 지원 서비스 - 공통 목업 데이터 (백엔드 연동 전 프론트 데모용)
   2026/07/13 ERD 변경 반영:
   - job: source는 JOBKOREA 단일 플랫폼만 사용, edu_require/emp_type/apply 컬럼 제거 (ERD에 없음)
   - members: user_id -> member_id로 명칭 변경, job_id/portfolio_id FK 제거,
     포트폴리오 정보(portfolio_file, portfolio_img, cname, portfolio_url)를 members 컬럼으로 통합
   - member_job_apply 테이블 신설: 지원 상태(PENDING/APPLY)를 member_id + job_id 조합으로 관리
*/

// ---- 공통 옵션 값 ----

// 직무 (job.job_part / members.user_job_part)
const POSITIONS = [
  "백엔드 개발자",
  "프론트엔드 개발자",
  "풀스택 개발자",
  "DevOps 엔지니어",
  "데이터 분석가",
];

// 희망/근무 지역
const REGION_OPTIONS = ["서울", "경기", "인천", "부산", "대전", "전국"];

// 경력조건 (job.personal_history / members.user_personal_history)
const CAREER_OPTIONS = ["신입", "경력 1~3년", "경력 3~5년", "경력 5년 이상", "경력무관"];

// 희망 급여 (members.user_pay)
const PAY_OPTIONS = ["3,000만원 미만", "3,000~4,000만원", "4,000~5,000만원", "5,000만원 이상", "협의 가능"];

// 플랫폼(source) 표기 - 현재는 JOBKOREA 단일 소스만 수집
const SOURCE_LABELS = { JOBKOREA: "잡코리아" };

// ---- 채용 공고(job) 목업 ----
const MOCK_JOBS = [
  {
    job_id: 1, post_id: "JK-20260701-001", source: "JOBKOREA",
    job_part: "프론트엔드 개발자", company_name: "네오위즈", post_title: "프론트엔드 개발자 (React) 채용",
    region: "서울 강남구", personal_history: "신입/경력 3년 이하",
    pay: "면접 후 결정", end_at: "2026-07-25", crawled_at: "2026-07-10",
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    job_id: 2, post_id: "JK-20260702-002", source: "JOBKOREA",
    job_part: "백엔드 개발자", company_name: "왓챠", post_title: "백엔드 서버 개발자 모집 (Node.js/Java)",
    region: "서울 마포구", personal_history: "경력 2~5년",
    pay: "4,000~5,200만원", end_at: "2026-07-31", crawled_at: "2026-07-10",
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    job_id: 3, post_id: "JK-20260703-003", source: "JOBKOREA",
    job_part: "풀스택 개발자", company_name: "리디", post_title: "풀스택 개발자 채용 (React/Spring)",
    region: "서울 강남구", personal_history: "경력무관",
    pay: "3,600~4,800만원", end_at: "2026-08-05", crawled_at: "2026-07-10",
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    job_id: 4, post_id: "JK-20260704-004", source: "JOBKOREA",
    job_part: "DevOps 엔지니어", company_name: "쏘카", post_title: "DevOps 엔지니어 (AWS/Kubernetes)",
    region: "경기 성남시", personal_history: "경력 3년 이상",
    pay: "5,000만원 이상", end_at: "2026-07-20", crawled_at: "2026-07-10",
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    job_id: 5, post_id: "JK-20260705-005", source: "JOBKOREA",
    job_part: "데이터 분석가", company_name: "뤼이드", post_title: "데이터 분석가 채용 (SQL/Python)",
    region: "서울 성동구", personal_history: "신입/경력",
    pay: "면접 후 결정", end_at: "2026-08-10", crawled_at: "2026-07-10",
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    job_id: 6, post_id: "JK-20260706-006", source: "JOBKOREA",
    job_part: "프론트엔드 개발자", company_name: "당근마켓", post_title: "프론트엔드 엔지니어 (TypeScript)",
    region: "서울 서초구", personal_history: "경력 1~4년",
    pay: "4,200~5,000만원", end_at: "2026-07-28", crawled_at: "2026-07-10",
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    job_id: 7, post_id: "JK-20260707-007", source: "JOBKOREA",
    job_part: "백엔드 개발자", company_name: "무신사", post_title: "백엔드 개발자 (Python/FastAPI)",
    region: "서울 성동구", personal_history: "경력 2년 이상",
    pay: "3,800~4,600만원", end_at: "2026-08-02", crawled_at: "2026-07-10",
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    job_id: 8, post_id: "JK-20260708-008", source: "JOBKOREA",
    job_part: "풀스택 개발자", company_name: "컬리", post_title: "풀스택 개발자 (Next.js/NestJS)",
    region: "경기 성남시", personal_history: "경력 3~7년",
    pay: "4,500~6,000만원", end_at: "2026-07-22", crawled_at: "2026-07-10",
    job_url: "https://www.jobkorea.co.kr/",
  },
];

// "수집하기" 버튼 클릭 시 순차로 추가되는 신규 수집분 (post_id UNIQUE 데모용).
// 3번째 클릭은 1번 공고와 동일한 post_id로 재수집되어 중복 제거되는 상황을 시연한다.
const EXTRA_JOBS_POOL = [
  {
    job_id: 9, post_id: "JK-20260709-009", source: "JOBKOREA",
    job_part: "DevOps 엔지니어", company_name: "토스", post_title: "DevOps/SRE 엔지니어 채용",
    region: "서울 강남구", personal_history: "경력 3~6년",
    pay: "5,500만원 이상", end_at: "2026-08-15", crawled_at: null,
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    job_id: 10, post_id: "JK-20260710-010", source: "JOBKOREA",
    job_part: "데이터 분석가", company_name: "야놀자", post_title: "데이터 분석가 (BI/Data Engineer)",
    region: "경기 성남시", personal_history: "경력 1~3년",
    pay: "면접 후 결정", end_at: "2026-08-12", crawled_at: null,
    job_url: "https://www.jobkorea.co.kr/",
  },
  {
    // post_id가 job_id 1과 동일 -> UNIQUE 제약으로 중복 저장되지 않아야 함
    job_id: 11, post_id: "JK-20260701-001", source: "JOBKOREA",
    job_part: "프론트엔드 개발자", company_name: "네오위즈", post_title: "프론트엔드 개발자 (React) 채용 [재수집]",
    region: "서울 강남구", personal_history: "신입/경력 3년 이하",
    pay: "면접 후 결정", end_at: "2026-07-25", crawled_at: null,
    job_url: "https://www.jobkorea.co.kr/",
  },
];

// ---- 회원(members) 목업 ----
// 포트폴리오 정보(portfolio_file, portfolio_img, cname, portfolio_url)는 별도 테이블 없이
// members 컬럼으로 직접 관리한다.
const MOCK_MEMBER = {
  member_id: 1,
  email: "doyeon.kim@example.com",
  password: "********", // 비밀번호는 화면에 노출하지 않음 (해시 저장 가정)
  nickname: "doyeon_kim",
  user_job_part: "프론트엔드 개발자",
  user_region: "서울",
  user_personal_history: "경력무관",
  user_pay: "4,000~5,000만원",
  created_at: "2026-06-01 09:15:00",
  updated_at: "2026-07-10 14:20:00",
  portfolio_file: null,
  portfolio_img: null,
  cname: "portfolio",
  portfolio_url: "pofile.greatsounds.me",
};

// CNAME 제공 서비스로부터 받을 도메인 네임 (서비스 제작 중이라 임시 목데이터).
// 완성되면 API 응답값으로 교체한다.
const MOCK_CNAME_DOMAIN = "example.com";

// ---- 회원 지원 현황(member_job_apply) 목업 ----
// member_id + job_id 조합으로 지원 상태(PENDING/APPLY)를 관리한다.
const MOCK_MEMBER_JOB_APPLY = [
  {
    id: 1, member_id: 1, job_id: 3, apply: "APPLY",
    applied_at: "2026-07-08 15:20:00", created_at: "2026-07-05 11:00:00",
  },
];

// ---- localStorage 헬퍼 (백엔드 연동 전 임시 저장소) ----

function loadPortfolio() {
  const base = {
    nickname: MOCK_MEMBER.nickname,
    portfolio_url: MOCK_MEMBER.portfolio_url,
    cname: MOCK_MEMBER.cname,
    portfolio_file: MOCK_MEMBER.portfolio_file,
    portfolio_img: MOCK_MEMBER.portfolio_img,
  };
  const saved = localStorage.getItem("mvp_member_portfolio");
  return saved ? { ...base, ...JSON.parse(saved) } : base;
}
function savePortfolio(data) {
  localStorage.setItem("mvp_member_portfolio", JSON.stringify(data));
}

// 업로드 파일의 실제 내용은 DB가 아닌 파일 저장소(/var/www/html/assets/{nickname}/)에 있다고 가정.
// 백엔드가 없는 프론트 데모 환경이라, 미리보기를 위해 파일 내용만 경로를 키로 별도 보관한다.
function assetPathFor(nickname, filename) {
  return `/var/www/html/assets/${nickname}/${filename}`;
}
function loadAssetStore() {
  const saved = localStorage.getItem("mvp_portfolio_assets");
  return saved ? JSON.parse(saved) : {};
}
function saveAsset(path, content) {
  const store = loadAssetStore();
  store[path] = content;
  localStorage.setItem("mvp_portfolio_assets", JSON.stringify(store));
}
function getAsset(path) {
  if (!path) return null;
  return loadAssetStore()[path] || null;
}

// members 희망 조건 (user_job_part, user_region, user_personal_history, user_pay)
function loadMemberPrefs() {
  const saved = localStorage.getItem("mvp_member_prefs");
  if (saved) {
    return JSON.parse(saved);
  }
  const { user_job_part, user_region, user_personal_history, user_pay } = MOCK_MEMBER;
  return { user_job_part, user_region, user_personal_history, user_pay };
}
function saveMemberPrefs(prefs) {
  localStorage.setItem("mvp_member_prefs", JSON.stringify(prefs));
}

// members 계정 정보 (email, password, nickname) - 회원가입 화면에서 사용
function loadMemberAccount() {
  const saved = localStorage.getItem("mvp_member_account");
  if (saved) return JSON.parse(saved);
  const { email, password, nickname } = MOCK_MEMBER;
  return { email, password, nickname };
}
function saveMemberAccount(account) {
  localStorage.setItem("mvp_member_account", JSON.stringify(account));
}

// member_job_apply 테이블 목업 - member_id + job_id 조합으로 지원 상태를 관리한다.
function loadMemberJobApply() {
  const saved = localStorage.getItem("mvp_member_job_apply");
  return saved ? JSON.parse(saved) : [...MOCK_MEMBER_JOB_APPLY];
}
function saveMemberJobApply(records) {
  localStorage.setItem("mvp_member_job_apply", JSON.stringify(records));
}

// 현재 로그인 회원(MOCK_MEMBER) 기준 특정 공고의 지원 상태 조회
function getApplyStatus(jobId) {
  const record = loadMemberJobApply().find(
    (r) => r.member_id === MOCK_MEMBER.member_id && r.job_id === jobId
  );
  return record ? record.apply : "PENDING";
}

// 지원 상태 토글 (PENDING <-> APPLY), 레코드가 없으면 새로 생성
function toggleApplyStatus(jobId) {
  const records = loadMemberJobApply();
  const record = records.find(
    (r) => r.member_id === MOCK_MEMBER.member_id && r.job_id === jobId
  );
  const now = new Date().toISOString();
  if (record) {
    record.apply = record.apply === "APPLY" ? "PENDING" : "APPLY";
    record.applied_at = record.apply === "APPLY" ? now : null;
  } else {
    records.push({
      id: records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1,
      member_id: MOCK_MEMBER.member_id,
      job_id: jobId,
      apply: "APPLY",
      applied_at: now,
      created_at: now,
    });
  }
  saveMemberJobApply(records);
}

// 현재 로그인 회원(MOCK_MEMBER)이 가장 최근에 지원/관심 등록한 공고 (마이페이지 표시용)
function getRecentInterestedJob() {
  const records = loadMemberJobApply().filter((r) => r.member_id === MOCK_MEMBER.member_id);
  if (!records.length) return null;
  const latest = records.reduce((a, b) => (a.id > b.id ? a : b));
  return MOCK_JOBS.find((j) => j.job_id === latest.job_id) || null;
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

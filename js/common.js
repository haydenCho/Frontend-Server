/* 취업 지원 서비스 - 공통 상수 & 유틸 (API 응답에 없는 화면 전용 옵션 값) */

// 직무 (job.job_part / members.user_job_part) - 입력 폼 자동완성/필터 옵션용
const POSITIONS = [
  "시스템 엔지니어",
  "네트워크 엔지니어",
  "보안 엔지니어",
  "클라우드 엔지니어",
  "IT 컨설팅",
];

// 희망/근무 지역
const REGION_OPTIONS = ["서울", "경기", "인천", "부산", "대전", "전국"];

// 경력조건 (job.personal_history / members.user_personal_history)
const CAREER_OPTIONS = ["신입", "경력 1~3년", "경력 3~5년", "경력 5년 이상", "경력무관"];

// 희망 급여 (members.user_pay)
const PAY_OPTIONS = ["3,000만원 미만", "3,000~4,000만원", "4,000~5,000만원", "5,000만원 이상", "협의 가능"];

// 플랫폼(source) 표기 - DB값은 영문(SARAMIN/JOBKOREA), 화면은 한글 표기
const SOURCE_LABELS = { SARAMIN: "사람인", JOBKOREA: "잡코리아" };

// CNAME 제공 서비스로부터 받을 도메인 네임 (서비스 제작 중이라 임시 목데이터).
// 완성되면 API 응답값으로 교체한다.
const MOCK_CNAME_DOMAIN = "example.com";

// 복수 선택 값 직렬화 - DB 컬럼(user_job_part, user_region)이 문자열이므로
// 쉼표 구분 문자열로 저장하고, 화면에서는 배열로 변환해 사용한다.
function parsePrefList(value) {
  if (Array.isArray(value)) return value;
  return value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

// 복수 선택 Chip 렌더링 - 클릭 시 선택/해제 토글
function renderChips(container, options, selectedSet) {
  container.innerHTML = "";
  options.forEach((opt) => {
    const chip = document.createElement("div");
    chip.className = "chip" + (selectedSet.has(opt) ? " selected" : "");
    chip.textContent = opt;
    chip.addEventListener("click", () => {
      if (selectedSet.has(opt)) selectedSet.delete(opt);
      else selectedSet.add(opt);
      renderChips(container, options, selectedSet);
    });
    container.appendChild(chip);
  });
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

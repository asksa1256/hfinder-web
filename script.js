/* 검색 */
const target = document.getElementById("searchInput");
const resultsContainer = document.querySelector(".results");

const apiCache = {}; // API 결과를 캐싱할 전역 객체

const displayData = (data, searchValue) => {
  resultsContainer.innerHTML =
    data.length === 0
      ? `<p>데이터가 없습니다.</p>`
      : data.map((item) => `<li>${item}</li>`).join("");
};

const fetchData = (src, searchValue) => {
  const cacheKey = `${src}_${searchValue}`;
  const cacheDuration = 86400 * 1000; // 캐시 유효 기간: 24시간 (밀리초 단위)

  // 캐시된 데이터 확인
  const cachedData = apiCache[cacheKey];
  if (cachedData) {
    const currentTime = new Date().getTime();
    // 캐시 유효 기간 확인
    if (currentTime - cachedData.timestamp < cacheDuration) {
      displayData(cachedData.data, searchValue);
      return;
    } else {
      // 캐시 만료 시 삭제
      delete apiCache[cacheKey];
    }
  }

  // API 호출 및 데이터 처리
  fetch(src)
    .then((response) => response.text())
    .then((data) => {
      const lines = data.split("\n");
      const searchValues = searchValue.split(" "); // 검색할 단어들을 공백 기준으로 분리
      const regex = new RegExp(`(${searchValues.join("|")})`, "gi"); // 정규 표현식 생성

      const highlightedResults = lines.reduce((result, line) => {
        const allWordsIncluded = searchValues.every((value) =>
          line.includes(value)
        );
        if (allWordsIncluded) {
          // 모든 단어가 포함된 경우 강조 표시
          result.push(
            line.replace(
              regex,
              (match) =>
                `<span class="emp">${match}</span>`
            )
          );
        }
        return result;
      }, []);

      // 캐시 저장
      apiCache[cacheKey] = {
        timestamp: new Date().getTime(),
        data: highlightedResults,
      };

      displayData(highlightedResults, searchValue);
    });
};

function search() {
  resultsContainer.classList.add("active");
  const searchValue = target.value;
  if (searchValue.length === 0) {
    resultsContainer.innerHTML = `<p>검색어를 입력해주세요.</p>`;
    return;
  }

  const selectedOption =
    document.getElementById("ctg").selectedOptions[0].value;

  const src =
    selectedOption === "1"
      ? "./data/all_utf8.txt"
      : selectedOption === "2"
      ? "./data/ox_utf8.txt"
      : selectedOption === "3"
      ? "./data/kkong_utf8.txt"
      : selectedOption === "4"
      ? "./data/olla_utf8.txt"
      : "./data/garo_utf8.txt";

  // api 호출
  fetchData(src, searchValue);
}

document.querySelector("#searchBtn").addEventListener("click", () => search());
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") search();
});

/* 폰트 변경 */
const fontSelect = document.querySelector("#fontSelect");

fontSelect.addEventListener("change", (e) => {
  let selectedNum = e.target.value;
  document.querySelector("html").setAttribute("data-font", selectedNum);
});

/* 테마 변경 */
const themeSelect = document.querySelector("#themeSelect");

themeSelect.addEventListener("change", (e) => {
  let selectedTheme = e.target.value;
  document.querySelector("body").setAttribute("data-theme", selectedTheme);
});

/* 눈내림 효과 */
const sf = new Snowflakes();
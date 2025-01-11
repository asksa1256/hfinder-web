/* 검색 */
const html = document.querySelector("html");
const body = document.querySelector("body");
const fontSelect = document.querySelector("#fontSelect");
const themeSelect = document.querySelector("#themeSelect");
const ctg = document.getElementById("ctg");
const target = document.getElementById("searchInput");
const resultsContainer = document.querySelector(".results");
const openModalBtn = document.querySelector(".open-modal-btn");
const closeBtn = document.querySelector(".close-btn");
const inputClearBtn = document.querySelector("#inputClearBtn");
// const sfChk = document.querySelector("#snowflakes");
const sfBtn = document.querySelector("#snowflakesBtn");
let themeIdx;
// let oxData = [];
// let ollaData = [];
// let kkongData = [];
// let garoData = [];
let oxData = new Set();
let ollaData = new Set();
let kkongData = new Set();
let garoData = new Set();

const fetchData = (selectedOption) => {
  const src =
    selectedOption === "1"
      ? "./data/ox_utf8.txt"
      : selectedOption === "2"
      ? "./data/olla_utf8.txt"
      : selectedOption === "3"
      ? "./data/kkong_utf8.txt"
      : "./data/garo_utf8.txt";

  if (src.includes("ox") && oxData.length > 0) return;
  if (src.includes("olla") && ollaData.length > 0) return;
  if (src.includes("kkong") && kkongData.length > 0) return;
  if (src.includes("garo") && garoData.length > 0) return;

  fetch(src)
    .then((response) => response.text())
    .then((data) => {
      splitData = data.split("\n");

      if (src.includes("ox") || src.includes("garo")) {
        splitData.forEach((line) => {
          const lastQstringIndex = line.lastIndexOf("(");
          const [question, answer] = [
            line.substring(0, lastQstringIndex + 1).trim(),
            line.substring(lastQstringIndex + 1).trim(),
          ];
          oxData.add({ question, answer });
        });
      }

      if (src.includes("olla")) {
        splitData.forEach((line) => {
          const lastQstringIndex = line.lastIndexOf("?");
          const [question, answer] = [
            line.substring(0, lastQstringIndex + 1).trim(),
            line.substring(lastQstringIndex + 1).trim(),
          ];
          ollaData.add({ question: question, answer });
        });
      }

      if (src.includes("kkong")) {
        splitData.forEach((line) => {
          const lastQstringIndex = line.lastIndexOf(" ");
          const [question, answer] = [
            line.substring(0, lastQstringIndex + 1).trim(),
            line.substring(lastQstringIndex + 1).trim(),
          ];
          kkongData.add({ question, answer });
        });
      }

      // if (src.includes("ox")) oxData = data.split("\n");
      // if (src.includes("olla")) ollaData = data.split("\n");
      // if (src.includes("kkong")) kkongData = data.split("\n");
      // if (src.includes("garo")) garoData = data.split("\n");
    });
};

ctg.addEventListener("change", (e) => {
  fetchData(e.target.value);
});

// const displayData = (results) => {
//   resultsContainer.innerHTML =
//     results.length === 0
//       ? `<p>데이터가 없습니다.</p>`
//       : results.map((item) => `<li>${item}</li>`).join("");
// };
const displayData = (results) => {
  console.log(results);
  resultsContainer.innerHTML =
    results.length === 0
      ? `<p>데이터가 없습니다.</p>`
      : results
          .map(
            (item) =>
              `<li>${item.question} <span class='answer'>${item.answer}</span></li>`
          )
          .join("");
};

function highlightedResults(dataLines, regex, searchValues) {
  return dataLines.reduce((result, line) => {
    const allWordsIncluded = searchValues.every((value) =>
      line.includes(value)
    );
    if (allWordsIncluded) {
      result.push(
        line.replace(regex, (match) => `<span class="emp">${match}</span>`)
      );
    }
    return result;
  }, []);
}

function searchInData(searchValue, selectedOption) {
  const searchValues = searchValue.split(" ");
  const regex = new RegExp(`(${searchValues.join("|")})`, "gi");
  const dataLines =
    selectedOption === "1"
      ? oxData
      : selectedOption === "2"
      ? ollaData
      : selectedOption === "3"
      ? kkongData
      : garoData;

  // 검색 결과 리턴
  const searchQuestions = (searchValue) => {
    const results = [];
    const searchValues = searchValue.split(" ");
    dataLines.forEach((item) => {
      if (searchValues.every((value) => item.question.includes(value))) {
        // 질문에 검색어 하이라이트 처리
        const highlightedQuestion = item.question.replace(
          regex,
          (match) => `<span class="emp">${match}</span>`
        );
        results.push({ question: highlightedQuestion, answer: item.answer });
      }
    });
    return results;
  };

  // displayData(highlightedResults(dataLines, regex, searchValues));
  displayData(searchQuestions(searchValue));
}

function search() {
  const selectedOption =
    document.getElementById("ctg").selectedOptions[0].value;
  const searchValue = target.value.trimStart();

  resultsContainer.classList.add("active");

  if (searchValue.length === 0) {
    resultsContainer.innerHTML = `<p>검색어를 입력해주세요.</p>`;
    return;
  }

  // 단어 검색
  searchInData(searchValue, selectedOption);
}

// 입력 시 300ms 이후 검색
function debounce(func, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

target.addEventListener("input", debounce(search, 300));

/* 폰트 변경 */
fontSelect.addEventListener("change", (e) => {
  let selectedNum = e.target.value;

  if (selectedNum === "1") {
    localStorage.removeItem("font");
  } else {
    localStorage.setItem("font", selectedNum);
  }

  html.setAttribute("data-font", selectedNum);
});

/* 테마 변경 */
themeSelect.addEventListener("change", (e) => {
  let selectedTheme = e.target.value;
  body.setAttribute("data-theme", selectedTheme);

  if (selectedTheme === "default") {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", selectedTheme);
  }

  body.setAttribute("data-theme", selectedTheme);
});

/* 눈 내리기 */
const sf = new Snowflakes();
const sfBody = document.querySelector(".snowflakes");
sfBody.classList.add("hide");

sfBtn.addEventListener("click", (e) => {
  const isActived = e.target.classList.contains("active");
  if (!isActived) {
    e.target.classList.add("active");
    sfBody.classList.remove("hide");
  } else {
    e.target.classList.remove("active");
    sfBody.classList.add("hide");
  }
});

/* 폰트, 테마 등 사용자 변경사항 로드 */
window.addEventListener("DOMContentLoaded", () => {
  const savedFontNum = localStorage.getItem("font");
  if (savedFontNum !== null) {
    html.setAttribute("data-font", savedFontNum);
    fontSelect.selectedIndex = savedFontNum * 1 - 1;
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme !== null) {
    body.setAttribute("data-theme", savedTheme);
    themeIdx = savedTheme.substring(savedTheme.length - 1);
    themeSelect.selectedIndex = themeIdx * 1;
  }

  const savedSnow = localStorage.getItem("snow");
  if (savedSnow !== null && savedSnow) {
    sfBtn.target.classList.add("active");
    sfBody.classList.remove("hide");
  } else {
    sfBtn.target.classList.remove("active");
    sfBody.classList.add("hide");
  }
});

/* 입력창 비우기 */
function addMultipleEventListener(element, events, handler) {
  events.forEach((e) => element.addEventListener(e, handler));
}

addMultipleEventListener(inputClearBtn, ["click", "focus"], () => {
  target.value = "";
  target.focus();
});

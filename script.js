/* 검색 */
const target = document.getElementById("searchInput");
const ctg = document.getElementById("ctg");
const resultsContainer = document.querySelector(".results");

let oxData = [];
let ollaData = [];
let kkongData = [];
let garoData = [];

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
      if (src.includes("ox")) oxData = data.split("\n");
      if (src.includes("olla")) ollaData = data.split("\n");
      if (src.includes("kkong")) kkongData = data.split("\n");
      if (src.includes("garo")) garoData = data.split("\n");
    });
};

ctg.addEventListener("change", (e) => {
  fetchData(e.target.value);
});

const displayData = (results, searchValue) => {
  resultsContainer.innerHTML =
    results.length === 0
      ? `<p>데이터가 없습니다.</p>`
      : results.map((item) => `<li>${item}</li>`).join("");
};

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

  const highlightedResults = dataLines.reduce((result, line) => {
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

  displayData(highlightedResults, searchValue);
}

function search() {
  const selectedOption = document.getElementById("ctg").selectedOptions[0].value;
  const searchValue = target.value.trimStart();

  resultsContainer.classList.add("active");

  if (searchValue.length === 0) {
    resultsContainer.innerHTML = `<p>검색어를 입력해주세요.</p>`;
    return;
  }

  // 단어 검색
  searchInData(searchValue, selectedOption);
}

/* 폰트 변경 */
const fontSelect = document.querySelector("#fontSelect");
const html = document.querySelector("html");

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
const themeSelect = document.querySelector("#themeSelect");
const body = document.querySelector("body");

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

/* 눈내림 효과 */
const sf = new Snowflakes();
sf.hide();
const sfChk = document.querySelector("#snowflakes");
sfChk.addEventListener("click", (e) => {
  if (e.target.checked === true) {
    sf.show();
    localStorage.setItem("snow", true);
  } else {
    sf.hide();
    localStorage.setItem("snow", false);
  }
});

/* 폰트, 테마 등 사용자 변경사항 로드 */
let themeIdx;

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
    sfChk.checked = true;
    sf.show();
  } else {
    sfChk.checked = false;
    sf.hide();
  }
});

/* 입력창 비우기 */
const inputClearBtn = document.querySelector('#inputClearBtn');

function addMultipleEventListener(element, events, handler) {
  events.forEach(e => element.addEventListener(e, handler))
}

addMultipleEventListener(inputClearBtn, ['click', 'focus'], () => {
  target.value = '';
  target.focus();
})

/* 빠른 입력 */
const quickmenu = document.querySelector('.quickmenu');
const quickmenuBtns = document.querySelectorAll('.quickmenu .quickbtn');
const hanjaBtns = document.querySelectorAll('.hanjabtn');
quickmenuBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    target.value += e.target.textContent;
  })
})

/* 모달 */
const openModalBtn = document.querySelector('.open-modal-btn');
const closeBtn = document.querySelector('.close-btn');
openModalBtn.addEventListener('click', function() {
  const targetModalName = this.getAttribute('data-target');
  const targetModal = document.querySelector(`#${targetModalName}`);
  targetModal.style.display = 'block';
})
closeBtn.addEventListener('click', function() {
  const targetModal = this.parentNode;
  targetModal.style.display = 'none';
})
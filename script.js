const target = document.getElementById('searchInput');
const resultsContainer = document.querySelector('.results');

const apiCache = {}; // API 결과를 캐싱할 전역 객체

const displayData = (data, searchValue) => {
  resultsContainer.innerHTML = data.length === 0
    ? `<p>데이터가 없습니다.</p>`
    : data.map(item => `<li>${item}</li>`).join('');
}

const fetchData = (src, searchValue) => {
  const cacheKey = `${src}_${searchValue.toLowerCase()}`;

  // 캐시된 데이터 확인
  if (apiCache[cacheKey]) {
    displayData(apiCache[cacheKey], searchValue);
    return;
  }

  // API 호출 및 데이터 처리
  fetch(src)
    .then(response => response.text())
    .then(data => {
      const lines = data.split('\n');
      const searchValueLower = searchValue.toLowerCase();
      const regex = new RegExp(`(${searchValue})`, 'gi');

      const highlightedResults = lines.reduce((result, line) => {
        const lineLower = line.toLowerCase();
        if (lineLower.includes(searchValueLower)) {
          // 필요한 경우에만 replace 호출: 공백 포함된 경우 검색 속도 향상
          result.push(line.replace(regex, match => `<span style="background-color: yellow; font-weight: bold;">${match}</span>`));
        }
        return result;
      }, []);
      
      // 캐시 저장
      apiCache[cacheKey] = highlightedResults;

      displayData(highlightedResults, searchValue);
    });
}

function search() {
  resultsContainer.classList.add('active')
  const searchValue = target.value.toLowerCase();
  if (searchValue.length === 0) {
    resultsContainer.innerHTML = `<p>검색어를 입력해주세요.</p>`;
    return;
  }

  const selectedOption = document.getElementById('ctg').selectedOptions[0].value;

  const src = 
    selectedOption === '1' ? './data/all_utf8.txt' 
      : selectedOption === '2' ? './data/ox_utf8.txt' 
        : selectedOption === '3' ? './data/kkong_utf8.txt' 
          : selectedOption === '4' ? './data/olla_utf8.txt' 
            : './data/garo_utf8.txt';

  // api 호출
  fetchData(src, searchValue);
}

document.querySelector('#searchBtn').addEventListener('click', () => search());
document.addEventListener('keydown', event => { 
  if (event.key === 'Enter') search();
});
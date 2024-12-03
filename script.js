const target = document.getElementById('searchInput');
const resultsContainer = document.querySelector('.results');

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

    fetch(src)
    .then(response => response.text())
    .then(data => {
      const lines = data.split('\n');
      const filteredResults = lines.filter(line => line.toLowerCase().includes(searchValue));

      const highlightedResults = filteredResults.map(line => {
        const regex = new RegExp(`(${searchValue})`, 'gi');
        return line.replace(regex, match => `<span style="background-color: yellow; font-weight: bold;">${match}</span>`);
      });

      resultsContainer.innerHTML = filteredResults.length === 0 ? `<p>데이터가 없습니다.</p>` : highlightedResults.map(item => `<li>${item}</li>`).join('');
    })
    .catch(error => console.error('Error fetching the file:', error));
}

document.querySelector('#searchBtn').addEventListener('click', () => search());
document.addEventListener('keydown', event => { 
  if (event.key === 'Enter') search();
});
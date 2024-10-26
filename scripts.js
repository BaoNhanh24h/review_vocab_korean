document.getElementById('uploadExcel').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = '';

        json.forEach((row) => {
            const [koreanWord, vietnameseMeaning] = row;
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td class="koreanWord">${koreanWord}</td>
                <td>${vietnameseMeaning}</td>
                <td><input type="text" class="inputKorean"></td>
                <td class="result"></td>
            `;
            tbody.appendChild(newRow);
        });

        const inputFields = document.querySelectorAll('.inputKorean');
        inputFields.forEach(inputField => {
            inputField.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    checkAnswers();
                }
            });
        });
    };

    reader.readAsArrayBuffer(file);
});

document.getElementById('checkButton').addEventListener('click', function() {
    checkAnswers();
});

function checkAnswers() {
    const rows = document.querySelectorAll('#vocabularyTable tbody tr');

    rows.forEach(row => {
        const koreanWord = row.querySelector('.koreanWord').textContent.trim();
        const inputKorean = row.querySelector('.inputKorean').value.trim();
        const resultCell = row.querySelector('.result');

        if (inputKorean === koreanWord) {
            resultCell.innerHTML = '<i class="fas fa-check"></i>';
            resultCell.classList.add('correct');
            resultCell.classList.remove('incorrect');
        } else {
            resultCell.innerHTML = '<i class="fas fa-times"></i>';
            resultCell.classList.add('incorrect');
            resultCell.classList.remove('correct');
        }
    });
}

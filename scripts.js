document.getElementById('uploadExcel').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0]; // Chọn sheet đầu tiên
        const worksheet = workbook.Sheets[sheetName];

        // Chuyển đổi sheet thành JSON
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Điền dữ liệu từ tệp Excel vào bảng
        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = ''; // Xóa dữ liệu cũ

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

        // Thêm sự kiện để kiểm tra khi nhấn Enter
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
            resultCell.textContent = '✔';
            resultCell.classList.add('correct');
            resultCell.classList.remove('incorrect');
        } else {
            resultCell.textContent = '✘';
            resultCell.classList.add('incorrect');
            resultCell.classList.remove('correct');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('menu-suspenso').addEventListener('change', function() {
        const selectedOption = this.value;
        if (selectedOption === 'ferias') {
            fetchAndDisplayData('Férias.xlsx', 'Férias');
        } else if (selectedOption === 'salario') {
            fetchAndDisplayData('Salário.xlsx', 'Salário');
        } else {
            document.getElementById('dados').innerHTML = '<h3>Selecione uma opção para exibir os dados</h3>';
        }
    });
});

async function fetchAndDisplayData(filename, type) {
    const blobUrl = `https://app03.blob.core.windows.net/app/${filename}?sp=racdl&st=2024-06-25T19:44:01Z&se=2024-06-26T03:44:01Z&spr=https&sv=2022-11-02&sr=c&sig=so0v4%2FIHIUHaEmqRJEiMxBZdsz3%2Fw5rYrPUhUekzNXA%3D`;
    try {
        const response = await fetch(blobUrl);
        if (!response.ok) {
            throw new Error('Erro ao buscar arquivo');
        }
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        const userRE = localStorage.getItem('userRE'); // Obtém o identificador do usuário
        const userData = jsonData.find(item => item.RE === userRE);

        if (userData) {
            displayData(userData, type);
        } else {
            alert('Dados do usuário não encontrados!');
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function displayData(data, type) {
    const dadosContainer = document.getElementById('dados');
    dadosContainer.innerHTML = `
        <h3>Dados de ${type}</h3>
        ${Object.keys(data).map(key => `<p><strong>${formatarPalavra(key)}:</strong> ${data[key]}</p>`).join('')}
    `;
}

function formatarPalavra(palavra) {
    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
}

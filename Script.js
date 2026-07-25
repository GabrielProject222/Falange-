// ======================
// CONTROLE DE DADOS
// ======================

const STORAGE_KEY = 'falange_dados';

function getDados() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

function salvarDados(dados) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ======================
// PÁGINA PRINCIPAL
// ======================

function renderCorredores() {
    const container = document.getElementById('corredoresGrupos');
    if (!container) return;

    const dados = getDados();
    let html = '';

    for (let inicio = 1; inicio <= 60; inicio += 10) {
        const fim = Math.min(inicio + 9, 60);
        html += `<div class="grupo">
            <h3>Corredores ${inicio} a ${fim}</h3>
            <div class="botoes-corredor">`;

        for (let i = inicio; i <= fim; i++) {
            const temItens = dados[i] && dados[i].length > 0;
            const classe = temItens ? 'has-items' : '';
            html += `<a href="corredor.html?id=${i}" class="${classe}">${i}</a>`;
        }

        html += `</div></div>`;
    }

    container.innerHTML = html;
}

function setupSearch() {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    const resultsBox = document.getElementById('searchResults');
    const corredoresSection = document.getElementById('corredoresSection');

    if (!input || !btn) return;

    function executarBusca() {
        const termo = input.value.trim().toLowerCase();
        if (!termo) {
            resultsBox.classList.add('hidden');
            corredoresSection.classList.remove('hidden');
            return;
        }

        // Se for só número → vai direto pro corredor
        if (/^\d+$/.test(termo)) {
            const num = parseInt(termo, 10);
            if (num >= 1 && num <= 60) {
                window.location.href = `corredor.html?id=${num}`;
                return;
            }
        }

        // Busca por nome de mercadoria
        const dados = getDados();
        const resultados = [];

        for (const corredor in dados) {
            dados[corredor].forEach(item => {
                if (item.nome.toLowerCase().includes(termo)) {
                    resultados.push({
                        corredor: corredor,
                        nome: item.nome,
                        quantidade: item.quantidade
                    });
                }
            });
        }

        if (resultados.length === 0) {
            resultsBox.innerHTML = `<h3>Nenhum resultado para "${input.value}"</h3>`;
        } else {
            let html = `<h3>Resultados para "${input.value}" (${resultados.length})</h3>`;
            resultados.forEach(r => {
                html += `
                <div class="result-item">
                    <div class="info">
                        <div class="nome">${r.nome}</div>
                        <div class="corredor-tag">Corredor ${r.corredor}</div>
                        <div class="qtd">${r.quantidade} palete${r.quantidade > 1 ? 's' : ''}</div>
                    </div>
                    <a href="corredor.html?id=${r.corredor}">Abrir</a>
                </div>`;
            });
            resultsBox.innerHTML = html;
        }

        resultsBox.classList.remove('hidden');
        corredoresSection.classList.add('hidden');
    }

    btn.addEventListener('click', executarBusca);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executarBusca();
    });

    // Limpar resultados quando apagar o campo
    input.addEventListener('input', () => {
        if (input.value.trim() === '') {
            resultsBox.classList.add('hidden');
            corredoresSection.classList.remove('hidden');
        }
    });
}

// ======================
// PÁGINA DO CORREDOR
// ======================

let corredorAtual = null;
let editandoId = null;

function initCorredorPage() {
    const params = new UR
... 

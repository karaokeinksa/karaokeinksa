// Declaração das variáveis globais no início do arquivo
let queue = [];
let loading = true;
let error = null;

function initializeAdmin() {
    // Create header
    const header = document.createElement('header');
    header.innerHTML = `
        <img src="images/logo.png" alt="Karaoke In Ksa" />
        <nav>
            <button id="btn-atualizar" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                Atualizar Fila
            </button>
        </nav>
    `;
    document.body.appendChild(header);

    // Create main content
    const main = document.createElement('main');
    main.id = 'admin-content';
    main.className = 'main-admin';
    document.body.appendChild(main);

    // Add event listeners
    document.getElementById('btn-atualizar').addEventListener('click', fetchQueue);

    // Initial fetch
    fetchQueue();
    // Set up auto-refresh
    setInterval(fetchQueue, 30000);
}

async function fetchQueue() {
    try {
        loading = true;
        updateUI();
        const response = await fetch('php/getFila.php');
        if (!response.ok) throw new Error('Failed to load queue');
        queue = await response.json();
        error = null;
    } catch (err) {
        error = 'Error loading queue: ' + err.message;
    } finally {
        loading = false;
        updateUI();
    }
}

async function handleDelete(index) {
    try {
        const response = await fetch('php/deleteFromQueue.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index })
        });
        if (!response.ok) throw new Error('Failed to delete item');
        await fetchQueue();
    } catch (err) {
        error = 'Error deleting item: ' + err.message;
        updateUI();
    }
}

async function handleMove(index, direction) {
    try {
        const response = await fetch('php/moveInQueue.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, direction })
        });
        if (!response.ok) throw new Error('Failed to move item');
        await fetchQueue();
    } catch (err) {
        error = 'Error moving item: ' + err.message;
        updateUI();
    }
}

function updateUI() {
    const main = document.getElementById('admin-content');
    
    if (loading) {
        main.innerHTML = '<div class="loading">Carregando...</div>';
        return;
    }

    let content = `
        <div class="admin-container">
            <h2>Gerenciamento da Fila</h2>
            ${error ? `<div class="error-message">${error}</div>` : ''}
            <div class="table-container">
                <table id="tabela-fila">
                    <thead>
                        <tr>
                            <th>FILA</th>
                            <th>NOME DA MÚSICA</th>
                            <th>ARTISTA</th>
                            <th>QUEM CANTA</th>
                            <th>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    if (queue.length === 0) {
        content += `
            <tr>
                <td colspan="5" class="fila-vazia">Nenhuma música na fila</td>
            </tr>
        `;
    } else {
        content += queue.map((item, index) => `
            <tr>
                <td class="numero-fila">${index + 1}</td>
                <td class="titulo-musica">${item.title}</td>
                <td>${item.artist}</td>
                <td>${item.cantor}</td>
                <td class="acoes">
                    <button onclick="handleMove(${index}, 'up')" 
                            ${index === 0 ? 'disabled' : ''} 
                            class="btn-move">↑</button>
                    <button onclick="handleMove(${index}, 'down')" 
                            ${index === queue.length - 1 ? 'disabled' : ''} 
                            class="btn-move">↓</button>
                    <button onclick="handleDelete(${index})" 
                            class="btn-delete">×</button>
                </td>
            </tr>
        `).join('');
    }

    content += `
                    </tbody>
                </table>
            </div>
            <div class="total-fila">
                Total: ${queue.length}
            </div>
        </div>
    `;

    main.innerHTML = content;
}

// Event listener para inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});
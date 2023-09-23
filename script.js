const url = 'https://karaokeinksa.github.io/karaokeinksa/portifolio.xlsx'; // Caminho para o arquivo .xlsx

fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => {
        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
    
        
        const table = document.querySelector('table tbody');

        const range = XLSX.utils.decode_range(sheet['!ref']);

        for (let R = range.s.r; R <= range.e.r; ++R) {
            const cantorCell = sheet[XLSX.utils.encode_cell({ r: R, c: 0 })];
            const musicaCell = sheet[XLSX.utils.encode_cell({ r: R, c: 1 })];

            if (cantorCell && musicaCell) {
                const cantor = cantorCell.v;
                const musica = musicaCell.v;
                

                const row = table.insertRow(-1);
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);

                
                cell1.innerHTML = cantor;
                cell2.innerHTML = musica;

                // Adiciona o botão "Selecionar"
                const selectButton = document.createElement('button');
                var nome = document.getElementById('nome');
                
                selectButton.innerHTML = 'Selecionar';
                selectButton.addEventListener('click', () => {
                    if (nome.value) {
                    alert(`Você selecionou:\n ${cantor} - ${musica}`);
                    enviarMusicaParaServidor(`${nome.value} - ${cantor} - ${musica}`);
                    document.getElementById('nome').value = '';
                    } else {
                        alert('Quem vai cantar? Escreva seu Nome');
    }
                });
                cell3.appendChild(selectButton);
            }
            
        }
        
    });

function enviarMusicaParaServidor(nome, cantor, musica) {
    const url = 'salvarMusica.php'; // Ajuste o URL conforme necessário

    const formData = new FormData();
    formData.append('nome', nome);  // Adiciona o nome ao formulário
    formData.append('cantor', cantor);
    formData.append('musica', musica);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Exibe a resposta do servidor
    })
    .catch(error => console.error('Erro:', error));
}


// Função de pesquisa
function pesquisar() {
    const termoPesquisa = document.getElementById('searchInput').value.toLowerCase();
    const linhas = document.querySelectorAll('#musicTable tbody tr');

    linhas.forEach(linha => {
        const cantor = linha.cells[0].innerText.toLowerCase();
        const musica = linha.cells[1].innerText.toLowerCase();

        const atendeCantor = cantor.includes(termoPesquisa);
        const atendeMusica = musica.includes(termoPesquisa);

        // Verifica se o cantor ou a música atendem ao critério de pesquisa
        const atendePesquisa = atendeCantor || atendeMusica;

        linha.style.display = atendePesquisa ? '' : 'none';
    });
}

function enviarMusica() {
    const nome = document.getElementById('nome').value;
    const cantor = document.getElementById('cantor').value;
    const musica = document.getElementById('musica').value;

    if (!nome) {
        alert('O campo NOME é obrigatório.');
        return false;
    }

    if (cantor && musica) {
        const linha = `${nome} - ${cantor} - ${musica}`;
        enviarMusicaParaServidor(linha);
    } else {
        alert('Por favor, preencha todos os campos.');
    }

    // Limpa os campos após o envio
    document.getElementById('cantor').value = '';
    document.getElementById('musica').value = '';

    return true;
}

        
function adicionarMusica(event) {
            event.preventDefault();  // Impede o envio padrão do formulário

            const nome = document.getElementById('nome').value;
            const cantor = document.getElementById('cantor').value;
            const musica = document.getElementById('musica').value;
            
            
            

            if (nome && cantor && musica) {
                const linha = `${nome} - ${cantor} - ${musica}`;
                enviarMusicaParaServidor(linha);
            } else {
                if (!nome) {
                alert('O campo NOME é obrigatório.');
            } else {
                alert('Por favor, preencha todos os campos.');
             }
            }

            // Limpa os campos após o envio
            document.getElementById('nome').value = '';
            document.getElementById('cantor').value = '';
            document.getElementById('musica').value = '';
           
        }
        
function enviarMusicaParaServidor(nome, cantor, musica) {
    const url = 'salvarMusica.php';

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('cantor', cantor);
    formData.append('musica', musica);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Exibe a resposta do servidor
    })
    .catch(error => console.error('Erro:', error));
}

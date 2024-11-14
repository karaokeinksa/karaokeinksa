document.addEventListener("DOMContentLoaded", function() {
    // Carregar músicas do portfolio.json
    carregarPortfolio();


    // Adicionar handler para o botão VER FILA
    const btnVerFila = document.getElementById('btn-ver-fila');
    if (btnVerFila) {
        btnVerFila.addEventListener('click', mostrarFila);
        console.log('Botão VER FILA configurado');
    } else {
        console.error('Botão VER FILA não encontrado');
    }

    // Adicionar handler para fechar modal ao clicar fora
    const modal = document.getElementById('modal-fila');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }
    // Adicionar handler para o botão de fechar do modal
    const btnFechar = document.querySelector('.fechar');
    if (btnFechar) {
        btnFechar.addEventListener('click', fecharModal);
    }

    // Adicionar handler para tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            fecharModal();
        }
    });
});
    // Adicionar handlers de eventos
    document.getElementById('btn-ver-fila').addEventListener('click', mostrarFila);
    document.getElementById('btn-digite-musica').addEventListener('click', inserirMusica);
    document.getElementById('pesquisar').addEventListener('input', pesquisarMusica);

async function carregarPortfolio() {
    try {
        const response = await fetch('data/portfolio.json');
        if (!response.ok) throw new Error('Erro ao carregar o portfólio');

        const portfolio = await response.json();

        // Mostrar as músicas no main
        mostrarMusicas(portfolio);
    } catch (error) {
        console.error("Falha ao carregar o portfólio: ", error);
        alert("Erro ao carregar o portfólio de músicas.");
    }
}

function mostrarMusicas(musicas) {
    const conteudo = document.getElementById('conteudo');
    conteudo.innerHTML = '';

    musicas.forEach(musica => {
        const musicaElemento = document.createElement('div');
        musicaElemento.className = 'musica';

        musicaElemento.innerHTML = `
            <img src="${musica.thumbnail || 'images/default-thumbnail.png'}" alt="${musica.title}" class="thumbnail" />
            <div class="info">
                <h3>${musica.artist}</h3>
                <p>${musica.title}</p>
            </div>
            <button class="btn-enviar" onclick="enviarMusica('${musica.title}', '${musica.artist}')">ENVIAR</button>
        `;

        conteudo.appendChild(musicaElemento);
    });
}
function enviarMusica(nomeMusica, artist) {
    const cantor = prompt(`Quem vai cantar "${nomeMusica}"?`);
    if (cantor) {
        // Aqui você pode adicionar a música à fila (arquivo fila.json ou array)
        adicionarAFila(nomeMusica, artist, cantor);
    }
}

async function adicionarAFila(nomeMusica, artist, cantor) {
    const filaInfo = { title: nomeMusica, artist: artist, cantor: cantor };
    try {
        const response = await fetch('php/adicionarMusica.php', { // Altere para o caminho do seu arquivo PHP
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filaInfo)
        });
        if (!response.ok) {
            throw new Error('Erro ao adicionar à fila');
        }

       const result = await response.json();
        
        if (result.success) {
            alert("Música adicionada à fila com sucesso!\nVerifique sua vez na fila!");
            // Atualizar a fila se o modal estiver aberto
            if (document.getElementById('modal-fila').style.display === 'flex') {
                await mostrarFila();
            }
        } else {
            alert("Erro ao adicionar música: " + result.message);
        }
    } catch (error) {
        console.error("Erro ao adicionar música:", error);
        alert("Erro ao adicionar música à fila. Tente novamente.");
    }
}

async function mostrarFila() {
    try {
        const response = await fetch('php/getFila.php');
        if (!response.ok) throw new Error('Erro ao carregar a fila');

        const fila = await response.json();
        const tabela = document.getElementById('tabela-fila');
        
        // Limpar tabela e adicionar cabeçalho
        tabela.innerHTML = `
            <tr>
                <th>FILA</th>
                <th>NOME DA MÚSICA</th>
                <th>ARTISTA</th>
                <th>QUEM CANTA</th>
            </tr>
        `;
 // Adicionar cada música com sua numeração
        fila.forEach((item, index) => {
            tabela.innerHTML += `
                <tr>
                    <td class="numero-fila">${index + 1}</td>
                    <td class="titulo-musica">${item.title}</td>
                    <td>${item.artist}</td>
                    <td>${item.cantor}</td>
                </tr>
            `;
        });

        // Se a fila estiver vazia, mostrar mensagem
        if (fila.length === 0) {
            tabela.innerHTML += `
                <tr>
                    <td colspan="4" class="fila-vazia">Nenhuma música na fila</td>
                </tr>
            `;
        }
        // Adicionar contador total
       const modalConteudo = document.querySelector('.modal-conteudo');
        if (modalConteudo) {
            const totalElement = document.createElement('div');
            totalElement.className = 'total-fila';
            totalElement.textContent = `Total de músicas: ${fila.length}`;
            
            const oldTotal = modalConteudo.querySelector('.total-fila');
            if (oldTotal) {
                oldTotal.remove();
            }
            modalConteudo.appendChild(totalElement);
        }

        // Mostrar o modal
        const modal = document.getElementById('modal-fila');
        if (modal) {
            modal.style.display = 'flex';
            console.log('Modal aberto'); // Debug
        } else {
            console.error('Elemento modal-fila não encontrado');
        }

    } catch (error) {
        console.error("Erro ao carregar fila:", error);
        alert("Erro ao carregar a fila de músicas.");
    }
}



function fecharModal() {
    const modal = document.getElementById('modal-fila');
    if (modal) {
        modal.style.display = 'none';
        console.log('Modal fechado'); // Debug
    }
}
function inserirMusica() {
    const title = prompt("Digite o nome da música:");
    const artist = prompt("Digite o nome do artista:");
    
    if (title && artist) {
        enviarMusica(title, artist);
    }
}
// Função global para limpar o campo de pesquisa
function limparPesquisa() {
    const campoPesquisa = document.getElementById('pesquisar');
    campoPesquisa.value = '';
    pesquisarMusica(); // Chama a função para exibir todas as músicas
    document.getElementById('btn-limpar-pesquisa').style.display = 'none'; // Esconde o botão "x"
}

// Função pesquisarMusica modificada para mostrar o botão "x" quando houver texto
async function pesquisarMusica() {
    const query = document.getElementById('pesquisar').value.toLowerCase();
    const elementos = document.getElementsByClassName('musica');
    const btnLimpar = document.getElementById('btn-limpar-pesquisa');

    // Exibe o botão "x" somente quando há texto no campo de pesquisa
    btnLimpar.style.display = query ? 'inline' : 'none';
    
    // Filtrar músicas locais
    Array.from(elementos).forEach(elemento => {
        const titulo = elemento.querySelector('h3').textContent.toLowerCase();
        const artista = elemento.querySelector('p').textContent.toLowerCase();
        
        if (titulo.includes(query) || artista.includes(query)) {
            elemento.style.display = '';
        } else {
            elemento.style.display = 'none';
        }
    });
   // Busca na API do YouTube
    if (query.length > 3) { // Limitar as chamadas à API até que o usuário tenha digitado mais de 3 caracteres
        const youtubeResults = await buscarNoYouTube(query);
        mostrarMusicasDoYouTube(youtubeResults);
    }
}

// Função para buscar na API do YouTube
async function buscarNoYouTube(query) {
    try {
        const apiKey = 'AIzaSyDEsBja3ODIuebawMEGPzzIFDqvosVz4Uk'; // Insira sua chave de API do YouTube
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${apiKey}`);
        if (!response.ok) throw new Error('Erro na requisição para o YouTube');
        
        const data = await response.json();
        return data.items.map(item => ({
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url,
            videoId: item.id.videoId
        }));
    } catch (error) {
        console.error("Erro ao buscar no YouTube:", error);
        return [];
    }
}

// Função para exibir músicas da API do YouTube
function mostrarMusicasDoYouTube(musicas) {
    const conteudo = document.getElementById('conteudo');
    
    // Remover resultados anteriores da API do YouTube
    Array.from(conteudo.getElementsByClassName('youtube')).forEach(elemento => elemento.remove());
    
    // Exibir cada música do YouTube
    musicas.forEach(musica => {
        const musicaElemento = document.createElement('div');
        musicaElemento.className = 'musica youtube';

        musicaElemento.innerHTML = `
            <img src="${musica.thumbnail}" alt="${musica.title}" class="thumbnail" />
            <div class="info">
                <h3>${musica.artist}</h3>
                <p>${musica.title}</p>
            </div>
            <button class="btn-enviar" onclick="enviarMusica('${musica.title}', '${musica.artist}')">ENVIAR</button>
        `;

        conteudo.appendChild(musicaElemento);
    });
}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('js/sw.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch(error => {
        console.error('Erro ao registrar o Service Worker:', error);
      });
  });
}

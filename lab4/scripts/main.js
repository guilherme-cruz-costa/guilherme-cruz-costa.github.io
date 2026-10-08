// main.js

// 1. Pesquisa de elementos e definição de variáveis
let contador = 0;
const mostradorContador = document.querySelector('#mostrador-contador');
const imagem = document.querySelector('#minha-imagem');
const areaMovimento = document.querySelector('#seccao-movimento');
const textoCoordenadas = document.querySelector('#texto-coordenadas');

// 2. Handlers dos Eventos

// Evento 1: click
function aumentarContador() {
    contador++;
    mostradorContador.textContent = contador; // Altera conteúdo HTML
    mostradorContador.style.color = '#e74c3c'; // Altera estilo
    mostradorContador.style.fontWeight = 'bold';
}

// Evento 2: dblclick
function reiniciarContador() {
    contador = 0;
    mostradorContador.textContent = contador; // Altera conteúdo HTML
    mostradorContador.style.color = '#333'; // Altera estilo
}

// Evento 3: mouseover
function destacarImagem() {
    imagem.style.transform = 'scale(1.1)'; // Altera estilo (aumenta o tamanho)
    imagem.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4)';
}

// Evento 4: mouseout
function normalizarImagem() {
    imagem.style.transform = 'scale(1)'; // Altera estilo (volta ao normal)
    imagem.style.boxShadow = 'none';
}

// Evento 5: mousemove
function mudarCorFundo(event) {
    // Capta a posição X e Y do rato e converte em cores
    const x = event.offsetX;
    const y = event.offsetY;

    // Altera estilo (cor de fundo) com base nas coordenadas
    areaMovimento.style.backgroundColor = `rgb(${x % 255}, ${y % 255}, 180)`;

    // Altera conteúdo HTML
    textoCoordenadas.textContent = `Magia em ação! Coordenadas: X=${x}, Y=${y}`;
    textoCoordenadas.style.color = 'white';
}

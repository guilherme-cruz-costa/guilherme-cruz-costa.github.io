// delcaração de variáveis
const nodeInputNumero = document.querySelector("main section:nth-child(2) form input:nth-child(1)")
const nodeInputSubmit = document.querySelector("main section:nth-child(2) form input:nth-child(2)")
const nodeUlColecao = document.querySelector("main section ul")
const colecao = JSON.parse(localStorage.getItem("colecao")) || []
const form = document.querySelector("form");

const totalCromos = document.querySelector("main section h3 span")
const totalCromosRepetidos = document.querySelector("main section:nth-child(3) h3 span")

const botaoEliminar = document.querySelectorAll("main section:nth-child(3) h3 span button")

const colecaoRepetidos = JSON.parse(localStorage.getItem("repetidos")) || []
const nodeUlColecaoRepetidos = document.querySelector("main section:nth-child(3) ul")

atualizaLista(colecao, nodeUlColecao);
atualizaLista(colecaoRepetidos, nodeUlColecaoRepetidos);
totalCromos.textContent = colecao.length;
totalCromosRepetidos.textContent = colecaoRepetidos.length;
ativarBotoesEliminar();

// B. event handlers

function guardarDados() {
    localStorage.setItem("colecao", JSON.stringify(colecao));
    localStorage.setItem("repetidos", JSON.stringify(colecaoRepetidos));
}

function guardaCarta(valor) {

    if (colecao.includes(valor)) {
        colecaoRepetidos.push(valor);
        colecaoRepetidos.sort((a, b) => a - b);
        atualizaLista(colecaoRepetidos, nodeUlColecaoRepetidos);
    } else {
        colecao.push(valor);
        colecao.sort((a, b) => a - b);
        atualizaLista(colecao, nodeUlColecao);
    }
    guardarDados();

}

function atualizaLista(colecao, nodeUlColecao) {

    while (nodeUlColecao.firstChild != null) {
        nodeUlColecao.removeChild(nodeUlColecao.firstChild);
    }

    colecao.forEach((cromo) => {

        const liAdicionar = document.createElement("li");

        if (colecao === colecaoRepetidos) {
            liAdicionar.innerHTML = `${cromo} <button class="btn-eliminar">Eliminar</button>`;
        } else {
            liAdicionar.textContent = cromo;
        }

        nodeUlColecao.appendChild(liAdicionar);

    })

}

// C. event listeners

function ativarBotoesEliminar() {
    const botoes = document.querySelectorAll(".btn-eliminar");

    botoes.forEach((botao, index) => {
        botao.addEventListener("click", () => {
            colecaoRepetidos.splice(index, 1);

            atualizaLista(colecaoRepetidos, nodeUlColecaoRepetidos);
            totalCromosRepetidos.textContent = colecaoRepetidos.length;

            guardarDados();

            ativarBotoesEliminar();
        });
    });
}


form.onsubmit = (event) => {
    event.preventDefault();

    const numero = Number(nodeInputNumero.value);

    guardaCarta(numero);

    totalCromos.textContent = colecao.length;
    totalCromosRepetidos.textContent = colecaoRepetidos.length;

    ativarBotoesEliminar();
}





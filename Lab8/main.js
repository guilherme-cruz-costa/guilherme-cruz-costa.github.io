// A. Estado e variáveis com referência de elementos do DOM
if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

let todosOsProdutos = [];

const contentorProdutos = document.querySelector('#lista-produtos');
const contentorCesto = document.querySelector('#lista-cesto');
const elementoPrecoTotal = document.querySelector('#preco-total');

const pesquisaInput = document.querySelector('#pesquisa-input');
const categoriaSelect = document.querySelector('#categoria-select');
const ordenarSelect = document.querySelector('#ordenar-select');

const estudanteCheckbox = document.querySelector('#estudante-checkbox');
const cupaoInput = document.querySelector('#cupao-input');
const comprarBtn = document.querySelector('#comprar-btn');
const mensagemCompra = document.querySelector('#mensagem-compra');


// B. Funções utilitárias
function obterUrlImagem(caminhoImagem) {
    if (caminhoImagem.startsWith('http')) {
        return caminhoImagem;
    }
    return 'https://deisishop.pw.deisi.ulusofona.pt' + (caminhoImagem.startsWith('/') ? '' : '/') + caminhoImagem;
}

function criarProduto(produto) {
    const artigo = document.createElement('article');

    const titulo = document.createElement('h2');
    titulo.textContent = produto.title;

    const imagem = document.createElement('img');
    imagem.src = obterUrlImagem(produto.image);
    imagem.alt = produto.title;

    const categoria = document.createElement('p');
    categoria.classList.add('produto-categoria');
    categoria.textContent = produto.category;

    const descricao = document.createElement('p');
    descricao.classList.add('produto-descricao');
    descricao.textContent = produto.description;

    const rating = document.createElement('p');
    rating.classList.add('produto-rating');
    if (produto.rating) {
        rating.textContent = `⭐ ${produto.rating.rate} (${produto.rating.count} avaliações)`;
    }

    const preco = document.createElement('p');
    preco.classList.add('produto-preco');
    preco.textContent = `${Number(produto.price).toFixed(2)} €`;

    const botao = document.createElement('button');
    botao.classList.add('btn-adicionar');
    botao.textContent = '+ Adicionar ao cesto';

    botao.addEventListener('click', () => {
        const listaSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
        listaSelecionados.push(produto);
        localStorage.setItem('produtos-selecionados', JSON.stringify(listaSelecionados));
        atualizaCesto();
    });

    artigo.append(titulo, imagem, categoria, descricao, rating, preco, botao);
    return artigo;
}

function criaProdutoCesto(produto, index) {
    const artigo = document.createElement('article');

    const titulo = document.createElement('h2');
    titulo.textContent = produto.title;

    const imagem = document.createElement('img');
    imagem.src = obterUrlImagem(produto.image);
    imagem.alt = produto.title;

    const preco = document.createElement('p');
    preco.classList.add('produto-preco');
    preco.textContent = `${Number(produto.price).toFixed(2)} €`;

    const botaoRemover = document.createElement('button');
    botaoRemover.classList.add('btn-eliminar');
    botaoRemover.textContent = '- Remover do cesto';

    botaoRemover.addEventListener('click', () => {
        const listaSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
        listaSelecionados.splice(index, 1);
        localStorage.setItem('produtos-selecionados', JSON.stringify(listaSelecionados));
        atualizaCesto();
    });

    artigo.append(titulo, imagem, preco, botaoRemover);
    return artigo;
}


// C. Renderização e atualização do DOM
function renderizarProdutos(produtos) {
    contentorProdutos.innerHTML = '';

    if (produtos.length === 0) {
        contentorProdutos.innerHTML = '<p class="cesto-vazio">Nenhum produto encontrado.</p>';
        return;
    }

    produtos.forEach(produto => {
        const artigoProduto = criarProduto(produto);
        contentorProdutos.append(artigoProduto);
    });
}

function atualizaCesto() {
    const listaSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    contentorCesto.innerHTML = '';

    let custoTotal = 0;

    if (listaSelecionados.length === 0) {
        const msgVazio = document.createElement('p');
        msgVazio.classList.add('cesto-vazio');
        msgVazio.textContent = 'O teu cesto está vazio.';
        contentorCesto.append(msgVazio);
    } else {
        listaSelecionados.forEach((produto, index) => {
            const artigoCesto = criaProdutoCesto(produto, index);
            contentorCesto.append(artigoCesto);
            custoTotal += Number(produto.price);
        });
    }

    elementoPrecoTotal.textContent = `${custoTotal.toFixed(2)} €`;
}


// D. Pedidos à API (GET)
function carregarCategorias() {
    fetch('https://deisishop.pw.deisi.ulusofona.pt/categories')
        .then(response => response.json())
        .then(categorias => {
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                const nomeCategoria = categoria.name ? categoria.name : categoria;
                option.value = nomeCategoria;
                option.textContent = nomeCategoria;
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar categorias:', error));
}

function carregarProdutos() {
    fetch('https://deisishop.pw.deisi.ulusofona.pt/products')
        .then(response => response.json())
        .then(produtosDaAPI => {
            todosOsProdutos = produtosDaAPI;
            atualizarListaProdutos();
        })
        .catch(error => {
            console.error('Erro ao obter produtos:', error);
            contentorProdutos.innerHTML = '<p class="cesto-vazio">Não foi possível carregar os produtos.</p>';
        });
}


// E. Lógica integrada de Filtro, Pesquisa e Ordenação
function atualizarListaProdutos() {
    const categoriaEscolhida = categoriaSelect.value;
    const ordemEscolhida = ordenarSelect.value;
    const termoPesquisa = pesquisaInput.value.toLowerCase().trim();

    let produtosFiltrados = todosOsProdutos;

    if (categoriaEscolhida !== 'todas') {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.category === categoriaEscolhida);
    }

    if (termoPesquisa !== '') {
        produtosFiltrados = produtosFiltrados.filter(produto =>
            produto.title.toLowerCase().includes(termoPesquisa)
        );
    }

    const produtosParaMostrar = [...produtosFiltrados];

    if (ordemEscolhida === 'asc') {
        produtosParaMostrar.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (ordemEscolhida === 'desc') {
        produtosParaMostrar.sort((a, b) => Number(b.price) - Number(a.price));
    }

    renderizarProdutos(produtosParaMostrar);
}


// F. Checkout (POST à API)
function finalizarCompra() {
    const listaSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];

    if (listaSelecionados.length === 0) {
        mensagemCompra.innerHTML = '<p class="msg-erro">O teu cesto está vazio!</p>';
        return;
    }

    const idsDosProdutos = listaSelecionados.map(produto => produto.id);
    const dadosDaCompra = {
        products: idsDosProdutos,
        student: estudanteCheckbox.checked,
        coupon: cupaoInput.value.trim()
    };

    fetch('https://deisishop.pw.deisi.ulusofona.pt/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosDaCompra)
    })
        .then(response => response.json())
        .then(resposta => {
            if (resposta.error) {
                mensagemCompra.innerHTML = `<p class="msg-erro">Erro: ${resposta.error}</p>`;
            } else {
                const valorFinal = resposta.totalCost !== undefined ? resposta.totalCost : resposta.total;

                mensagemCompra.innerHTML = `
                    <div class="msg-sucesso">
                        <p><strong>Compra finalizada com sucesso!</strong></p>
                        <p>Referência MB: <strong>${resposta.reference}</strong></p>
                        <p>Valor Total a Pagar: <strong>${Number(valorFinal).toFixed(2)} €</strong></p>
                    </div>
                `;

                localStorage.setItem('produtos-selecionados', JSON.stringify([]));
                atualizaCesto();
                estudanteCheckbox.checked = false;
                cupaoInput.value = '';
            }
        })
        .catch(error => {
            console.error('Erro na compra:', error);
            mensagemCompra.innerHTML = '<p class="msg-erro">Ocorreu um erro ao comunicar com o servidor.</p>';
        });
}


// G. Event Listeners
categoriaSelect.addEventListener('change', atualizarListaProdutos);
ordenarSelect.addEventListener('change', atualizarListaProdutos);
pesquisaInput.addEventListener('input', atualizarListaProdutos);
comprarBtn.addEventListener('click', finalizarCompra);


// H. Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarProdutos();
    atualizaCesto();
});
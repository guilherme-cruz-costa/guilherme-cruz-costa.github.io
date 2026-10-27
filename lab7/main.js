// A. Estado e variáveis com referência de elementos do DOM

if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

const contentorProdutos = document.querySelector('#lista-produtos');
const contentorCesto = document.querySelector('#lista-cesto');
const elementoPrecoTotal = document.querySelector('#preco-total');


// B. Funções utilitárias

function criarProduto(produto) {
    const artigo = document.createElement('article');

    const titulo = document.createElement('h2');
    titulo.textContent = produto.title;

    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const categoria = document.createElement('p');
    categoria.classList.add('produto-categoria');
    categoria.textContent = produto.category;

    const descricao = document.createElement('p');
    descricao.classList.add('produto-descricao');
    descricao.textContent = produto.description;

    const rating = document.createElement('p');
    rating.classList.add('produto-rating');
    rating.textContent = `⭐ ${produto.rating.rate} (${produto.rating.count} avaliações)`;

    const preco = document.createElement('p');
    preco.classList.add('produto-preco');
    preco.textContent = `${produto.price.toFixed(2)} €`;

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

function criaProdutoCesto(produto) {
    const artigo = document.createElement('article');

    const titulo = document.createElement('h2');
    titulo.textContent = produto.title;

    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const preco = document.createElement('p');
    preco.classList.add('produto-preco');
    preco.textContent = `${produto.price.toFixed(2)} €`;

    const botaoRemover = document.createElement('button');
    botaoRemover.classList.add('btn-eliminar');
    botaoRemover.textContent = '- Remover do cesto';

    botaoRemover.addEventListener('click', () => {
        const listaSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
        const indice = listaSelecionados.findIndex(item => item.id === produto.id);

        if (indice !== -1) {
            listaSelecionados.splice(indice, 1);
            localStorage.setItem('produtos-selecionados', JSON.stringify(listaSelecionados));
        }

        atualizaCesto();
    });

    artigo.append(titulo, imagem, preco, botaoRemover);
    return artigo;
}


// C. Event handlers

function renderizarProdutos(produtos) {
    contentorProdutos.innerHTML = '';

    produtos.forEach(produto => {
        console.log(produto.title);
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
        listaSelecionados.forEach(produto => {
            const artigoCesto = criaProdutoCesto(produto);
            contentorCesto.append(artigoCesto);
            custoTotal += produto.price;
        });
    }

    elementoPrecoTotal.textContent = `${custoTotal.toFixed(2)} €`;
}


// D. Event Listeners
// (Os listeners de adicionar e remover são associados dinamicamente na criação de cada cartão)


// E. Inicialização

console.log(produtos[0].description);
renderizarProdutos(produtos);
atualizaCesto();

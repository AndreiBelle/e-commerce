import GerenProdutos from "../models/Produto.js";

const produtos = document.getElementById('produtos');
const botoesMenu = document.querySelectorAll('.btn-filtro');
const btn_inicio = document.getElementById('btn-inicio');
const inputPesquisa = document.getElementById('input-pesquisar');

const dadosIsAdmin = localStorage.getItem('isAdmin');
const isAdmin = JSON.parse(dadosIsAdmin);

let botaoExcluirHTML = '';

    if (isAdmin === true) {
        botaoExcluirHTML = `
        <div class="excluir">
            <button class="btn-excluir">X</button>
        </div>`;
    }

async function listarProdutos() {
    try {
        const dados = await GerenProdutos.buscarTodos();

        produtos.innerHTML = '';

        let estruturaHTML = '';

        dados.rows.forEach(row => {

            const produto = row.doc;

            estruturaHTML += `
            <div class="card-produto">
                ${botaoExcluirHTML}
                <div class="img-produto">
                    <img src="${produto.imagem}">
                </div>
                <div class="info-produto">
                    <h3>${produto.titulo}</h3>
                    <p>${produto.descricao}</p>
                    <span>R$ ${produto.valor.toFixed(2)}</span>
                </div>
            </div>
        `;

        });

        produtos.insertAdjacentHTML('beforeend', estruturaHTML);

    } catch (erro) {
        console.error("Erro ao listar produtos:", erro);
    }
}
listarProdutos();

async function filtrarProdutos(event) {
    event.preventDefault();

    const categoria = event.target.textContent.trim();


    try {
        const resultadoFiltro = await GerenProdutos.BuscarPorCategoria(categoria);

        console.log("Resultado Banco: ", resultadoFiltro);

         produtos.innerHTML = '';

        let estruturaHTML = '';

        resultadoFiltro.forEach(produtoFiltrado => {
            estruturaHTML += `
            <div class="card-produto">
                ${botaoExcluirHTML}
                <div class="img-produto">
                    <img src="${produtoFiltrado.imagem}">
                </div>
                <div class="info-produto">
                    <h3>${produtoFiltrado.titulo}</h3>
                    <p>${produtoFiltrado.descricao}</p>
                    <span>R$ ${produtoFiltrado.valor.toFixed(2)}</span>
                </div>
            </div>
        `;

        });

        produtos.insertAdjacentHTML('beforeend', estruturaHTML);

    } catch (erro) {
        console.error("Erro ao listar produtos filtrados:", erro);
    }
}

async function pesquisaProdutos(event) {
    event.preventDefault();

    const pesquisa = event.target.value;

    try {
        const resultadoFiltro = await GerenProdutos.BuscarPesquisa(pesquisa                                                            );

         produtos.innerHTML = '';

        let estruturaHTML = '';

        resultadoFiltro.forEach(produtoFiltrado => {
            estruturaHTML += `
            <div class="card-produto">
                ${botaoExcluirHTML}
                <div class="img-produto">
                    <img src="${produtoFiltrado.imagem}">
                </div>
                <div class="info-produto">
                    <h3>${produtoFiltrado.titulo}</h3>
                    <p>${produtoFiltrado.descricao}</p>
                    <span>R$ ${produtoFiltrado.valor.toFixed(2)}</span>
                </div>
            </div>
        `;

        });

        produtos.insertAdjacentHTML('beforeend', estruturaHTML);

    } catch (erro) {
        console.error("Erro ao listar produtos filtrados:", erro);
    }

    
}
inputPesquisa.addEventListener('input', pesquisaProdutos)

botoesMenu.forEach(function(botao) {
    console.log("Botoes encontrados: \n"+botao)
    botao.addEventListener("click", filtrarProdutos);
});
btn_inicio.addEventListener("click", listarProdutos)

import GerenProdutos from "../models/Produto.js";

const produtos = document.getElementById('produtos');

async function listarProdutos() {
    try {
        const dados = await GerenProdutos.buscarTodos();

        produtos.innerHTML = '';

        let estruturaHTML = '';

        dados.rows.forEach(row => {

            const produto = row.doc;

            estruturaHTML += `
            <div class="card-produto">
                <div class="img-produto">
                    <img src="${produto.imagem}" style="height: 150px;">
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
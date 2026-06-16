import GerenProdutos from "../models/Produto.js";
import { modalExcluir } from "../utils/modal.js";
import { toast } from "../utils/notificacao.js";

const produtos = document.getElementById('produtos');
const botoesMenu = document.querySelectorAll('.btn-filtro');
const btn_inicio = document.getElementById('btn-inicio');
const inputPesquisa = document.getElementById('input-pesquisar');
const dadosIsAdmin = localStorage.getItem('isAdmin');
const isAdmin = JSON.parse(dadosIsAdmin);
const userLogado = localStorage.getItem('usuarioLogado');



async function listarProdutos() {
    try {
        const dados = await GerenProdutos.buscarTodos();
        produtos.innerHTML = '';
        let estruturaHTML = '';

        dados.rows.forEach(row => {
            const produto = row.doc;
            let botaoExcluirHTML = '';
            
            if (isAdmin === true) {
                botaoExcluirHTML = `
                <div class="excluir">
                    <button class="btn-excluir" data-id="${produto._id}">X</button>
                </div>`;
            }
            
            estruturaHTML += `
            <div class="item-vitrine">
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
                
                <div class="container-botoes">
                    <button class="btn-carrinho">Adicionar ao Carrinho</button>
                    <button class="btn-comprar">Comprar agora</button>
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
        produtos.innerHTML = '';
        let estruturaHTML = '';

        resultadoFiltro.forEach(produtoFiltrado => {
            let botaoExcluirHTML = '';
            
            if (isAdmin === true) {
                botaoExcluirHTML = `
                <div class="excluir">
                    <button class="btn-excluir" data-id="${produtoFiltrado._id}">X</button>
                </div>`;
            }

            estruturaHTML += `
            <div class="item-vitrine">
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
                
                <div class="container-botoes">
                    <button class="btn-carrinho">Adicionar ao Carrinho</button>
                    <button class="btn-comprar">Comprar agora</button>
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
        const resultadoFiltro = await GerenProdutos.BuscarPesquisa(pesquisa);
        produtos.innerHTML = '';
        let estruturaHTML = '';

        resultadoFiltro.forEach(produtoFiltrado => {
            let botaoExcluirHTML = '';
            
            if (isAdmin === true) {
                botaoExcluirHTML = `
                <div class="excluir">
                    <button class="btn-excluir" data-id="${produtoFiltrado._id}">X</button>
                </div>`;
            }
            
            estruturaHTML += `
            <div class="item-vitrine">
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
                
                <div class="container-botoes">
                    <button class="btn-carrinho">Adicionar ao Carrinho</button>
                    <button class="btn-comprar">Comprar agora</button>
                </div>
            </div>
            `;
        });

        produtos.insertAdjacentHTML('beforeend', estruturaHTML);
    } catch (erro) {
        console.error("Erro ao listar produtos filtrados:", erro);
    }
}

inputPesquisa.addEventListener('input', pesquisaProdutos);
btn_inicio.addEventListener("click", listarProdutos);

botoesMenu.forEach(function(botao) {
    botao.addEventListener("click", filtrarProdutos);
});


document.addEventListener('click', async function(event) {
    
    if (event.target.classList.contains('btn-excluir')) {
        event.preventDefault();
        const idProd = event.target.getAttribute('data-id');
        
        if (idProd) {
            const retorno = await modalExcluir("produto");
            if (retorno.isConfirmed === true) {
                try {
                    const resultado = await GerenProdutos.excluirProduto(idProd);
                    if (resultado.sucesso === true) {
                        toast(resultado.mensagem, "sucesso");
                        setTimeout(() => { window.location.replace("../views/index.html") }, 1200);
                    } else {
                        toast("Produto não encontrado", "erro");
                    } 
                } catch (err) {
                    console.error("Erro ao excluir produto: ", err);
                    toast("Problema ao excluir produto: " + err, "erro");
                }
            } else {
                toast("Você CANCELOU a operação!", "sucesso");
            }
        }
        return; 
    }

    if (event.target.classList.contains('btn-carrinho')) {
        const vitrine = event.target.closest('.item-vitrine');
        
        if (!userLogado || !dadosIsAdmin) {
            toast("Você deve se logar no site antes de adicionar um produto ao carrinho!", "erro")
            return;
        }

        const produtoParaCarrinho = {
            titulo: vitrine.querySelector('.info-produto h3').textContent,
            preco: parseFloat(vitrine.querySelector('.info-produto span').textContent.replace('R$ ', '')),
            imagem: vitrine.querySelector('.img-produto img').src
        };

        let cestinha = JSON.parse(localStorage.getItem('carrinho')) || [];
        cestinha.push(produtoParaCarrinho);
        localStorage.setItem('carrinho', JSON.stringify(cestinha));

        toast('Produto adicionado ao carrinho!', 'sucesso');
        return; 
    }

    if (event.target.classList.contains('btn-comprar')) {
        const vitrine = event.target.closest('.item-vitrine');
        const titulo = vitrine.querySelector('.info-produto h3').textContent;
        const preco = parseFloat(vitrine.querySelector('.info-produto span').textContent.replace('R$ ', ''));

        if (!userLogado || !dadosIsAdmin) {
            toast("Você deve se logar no site antes de comprar!", "erro")
            return;
        }

        const confirmacao = await Swal.fire({
            title: 'Confirmar Compra',
            text: `Deseja comprar o ${titulo} por R$ ${preco.toFixed(2)}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, finalizar agora!',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacao.isConfirmed) {
            Swal.fire('Sucesso!', 'Sua compra foi realizada, vamos seguir com o processo de compra e logo retornamos com os dados e informações de rastreio. Obrigado!', 'success');
        }
        return;
    }

    const itemClicado = event.target.closest('.item-vitrine');

    if (itemClicado) {
        const jaEstavaAberto = itemClicado.classList.contains('expandido');
        
        document.querySelectorAll('.item-vitrine.expandido').forEach(item => {
            item.classList.remove('expandido');
        });

        if (!jaEstavaAberto) {
            itemClicado.classList.add('expandido');
        }
    } else {
        document.querySelectorAll('.item-vitrine.expandido').forEach(item => {
            item.classList.remove('expandido');
        });
    }
});
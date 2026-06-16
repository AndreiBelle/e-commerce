const listaCarrinho = document.getElementById('lista-carrinho');
const txtTotal = document.getElementById('total-carrinho');
const btnFinalizar = document.getElementById('btn-finalizar-carrinho');
import { modalExcluir } from "../utils/modal.js";
import { toast } from "../utils/notificacao.js";

const dadosIsAdmin = localStorage.getItem('isAdmin');
const userLogado = localStorage.getItem('usuarioLogado');


if (!userLogado || !dadosIsAdmin) {
    
    toast("Acesso negado. Você não tem permissão para acessar esta página.", "erro");
    
    setTimeout(() => {
        window.location.replace("../views/index.html");
    }, 1200); 

}

function meuCarrinho() {
    
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    listaCarrinho.innerHTML = '';
    
    let valorTotal = 0;

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = `<div class="carrinho-vazio">Seu carrinho está vazio! 😢</div>`;
        txtTotal.textContent = "R$ 0.00";
        btnFinalizar.classList.add('hidden')
    }

    btnFinalizar.style.display = "block";

   
    carrinho.forEach((produto, index) => {
        valorTotal += produto.preco;
        
        const cartaoHTML = `
            <div class="item-carrinho">
                <img src="${produto.imagem}" alt="Produto">
                <div class="info-item-carrinho">
                    <h3>${produto.titulo}</h3>
                    <p>R$ ${produto.preco.toFixed(2)}</p>
                </div>
                <button class="btn-excluir" onclick="removerDoCarrinho(${index})">X</button>
            </div>
        `;
        
        listaCarrinho.insertAdjacentHTML('beforeend', cartaoHTML);
    });

    txtTotal.textContent = `R$ ${valorTotal.toFixed(2)}`;
}


window.removerDoCarrinho = function(posicaoNaFila) {
    let cestinha = JSON.parse(localStorage.getItem('carrinho')) || [];
    
  
    cestinha.splice(posicaoNaFila, 1);
    
    localStorage.setItem('carrinho', JSON.stringify(cestinha));
    
    toast("Produto removido com sucesso do seu carrinho!", "sucesso")
    
    meuCarrinho();
}


btnFinalizar.addEventListener('click', async () => {
    
    const confirmacao = await Swal.fire({
        title: 'Confirmar Pedido',
        text: "Deseja finalizar o pagamento de todos os itens?",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Pagar e Finalizar',
        cancelButtonText: 'Continuar Comprando'
    });

    if (confirmacao.isConfirmed) {
        
        localStorage.removeItem('carrinho');
        
        await Swal.fire('Sucesso!', 'Seu pedido está sendo preparado para envio!', 'success');
        
        window.location.replace("../views/index.html");
    }
});

meuCarrinho();
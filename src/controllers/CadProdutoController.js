import GerenProdutos from "../models/Produto.js";
import { toast } from "../utils/notificacao.js";


const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

if (!isAdmin) {
    toast("Acesso negado. Você não tem permissão para acessar esta página.", "erro");
    
    setTimeout(() => {
        window.location.replace("../views/index.html");
    }, 1500); 

}


const formulario = document.getElementById("form-produto");

async function CadastrarProduto(event) {
    event.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const categoria = document.getElementById("categoria").value;
    const imagemUrl = document.getElementById("imagemUrl").value;
    const descricao = document.getElementById("descricao").value;
    

    try {
        const resultado = await GerenProdutos.CadastrarProduto(titulo, valor, descricao, imagemUrl, categoria);



        if (resultado.ok) {
            toast("Produto cadastrado com sucesso!", "sucesso");


            const confirmacao = await Swal.fire({
            title: 'Produto cadastrado!',
            text: `Deseja cadastrar mais um anúncio de produto?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não'
            });

            if (confirmacao.isConfirmed) {
            setTimeout(() => {
                window.location.reload();
            }, 800);
            } else {
            setTimeout(() => {
                window.location.replace("../views/index.html")
            }, 800);
            }
        } else {
            toast(resultado.mensagem, "erro");
        }
    } catch (err) {
        toast("Erro ao cadastrar produto: "+ err,"erro");
    }
}

formulario.addEventListener("submit", CadastrarProduto);
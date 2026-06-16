import GerenUsuarios from "../models/User.js";
import { toast } from "../utils/notificacao.js";
import { modalExcluir } from "../utils/modal.js";

const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
const inputAdm = document.getElementById('input-adm');
const btn_cancel = document.getElementById('btn-cancel');
const formEditar = document.getElementById('editarForm');
const btnSalvar = document.getElementById('btn-salvar');
const btnExcluir = document.getElementById('btn-excluir');

if (!isAdmin) {
    
    toast("Acesso negado. Você não tem permissão para acessar esta página.", "erro");
    
    setTimeout(() => {
        window.location.replace("../views/index.html");
    }, 1500); 

}

document.addEventListener('DOMContentLoaded', async () => {
    
    const parametros = new URLSearchParams(window.location.search);
    const idUsuario = parametros.get('id');
    const user = await GerenUsuarios.buscarUser(idUsuario)

    inputAdm.innerHTML = "";
    let estruturaHTML = "";

        user.forEach(dados => {

            const ehAdmin = dados.isAdmin === true ? 'checked' : '';

            estruturaHTML += `
            <div>
                <input type="checkbox" 
                    class="checkbox-admin"
                    id="adm_${dados._id}" 
                    data-id="${dados._id}" 
                    value="True" 
                    ${ehAdmin}>
                <label for="adm_${dados._id}">Esse usuário é um Administrador do sistema?</label>
            </div>
            `;


            document.getElementById("usuario").value = dados.usuario;
            document.getElementById("email").value = dados._id;
        
    });
    inputAdm.insertAdjacentHTML('beforeend', estruturaHTML);

    async function atualizarStatusAdmin(idUsuario, statusMarcado) {
    try {
        await GerenUsuarios.atualizarPermissao(idUsuario, statusMarcado);

        if (statusMarcado == true) {
            toast(`Sucesso! O usuário agora é um Administrador.`, "sucesso"); 
        } else { 
            toast(`O usuário NÃO é mais Administrador.`, "sucesso"); 
        }
        
    } catch (erro) {
        toast("Ocorreu um erro ao salvar a permissão.", "erro");
        listarTodos(); 
    }

}

inputAdm.addEventListener('change', function(evento) {
    
    if (evento.target.classList.contains('checkbox-admin')) {
        
        const idDoUsuario = evento.target.getAttribute('data-id');
        
        const estaMarcado = evento.target.checked;
        
        atualizarStatusAdmin(idDoUsuario, estaMarcado);
    }
});

btn_cancel.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.replace("../views/config.html"); 
    });


});

async function atualizarUser() {

    const parametros = new URLSearchParams(window.location.search);
    const idAntigo = parametros.get('id');
    
    const novoEmail = document.getElementById("email").value;
    const novoUsuario = document.getElementById("usuario").value;
    
    
    const resultado = await GerenUsuarios.editarUser(idAntigo, novoEmail, idAntigo ,novoUsuario);

    if (resultado.sucesso === true) {
        toast(resultado.mensagem, "sucesso");
        
        setTimeout(() => {
            window.location.replace(`../views/config.html`);
        }, 1200);

    } else {
        toast(resultado.mensagem, "erro");
    }    
}

btnSalvar.addEventListener('click', async (event) => {
    event.preventDefault()

    atualizarUser();
    
});

formEditar.addEventListener("submit", atualizarUser);

async function excluirUser() {
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    const retorno = await modalExcluir("usuário");

    if (retorno.isConfirmed === true) {
        try {
        const resultado = await GerenUsuarios.excluirUser(id);

        if (resultado.sucesso === true) {
            toast(resultado.mensagem, "sucesso");

            setTimeout(() => {
                window.location.replace("../views/config.html")
            }, 800);
        } else {
            toast("Usuário não encontrado", "erro");
        } 
    } catch (err) {
        console.error("Erro ao exluir usuário: ",err);
        toast("Problema ao excluir usuário: ",err);
    }
    } else {
        toast("Você CANCELOU a operação!", "sucesso")
    }
    
}

btnExcluir.addEventListener("click", function(event) {
    event.preventDefault();

    excluirUser();
})
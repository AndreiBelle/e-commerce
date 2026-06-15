import GerenUsuarios from "../models/User.js";
import { toast } from "../utils/notificacao.js";

const usuarios = document.getElementById("usuarios");
const inicio = document.getElementById("inicio");
const gerenciador = document.getElementById("gerenciador");
const btn_gerenciador = document.getElementById('btn-gerenciador');

const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

if (!isAdmin) {
    
    toast("Acesso negado. Você não tem permissão para acessar esta página.", "erro");
    
    setTimeout(() => {
        window.location.replace("../views/index.html");
    }, 1500); 

}

document.addEventListener("DOMContentLoaded", () => {
    const abaSalva = sessionStorage.getItem("abaAberta");
    if (abaSalva === "gerenciador") {
        inicio.classList.add("hidden");
        gerenciador.classList.remove("hidden");
        sessionStorage.removeItem("abaAberta");
    }
});

async function listarTodos() {
    try {
        const dados = await GerenUsuarios.listarUsuarios();
        
        usuarios.innerHTML = '';

        let estruturaHTML = '';

        dados.rows.forEach(row => {
            
            const user = row.doc;


            const ehAdmin = user.isAdmin === true ? 'checked' : '';

            estruturaHTML += `
            <div class="card-usuario">
                <div class="img-user">
                    <img src="../../public/perfil.png" style="height: 150px;"></img>
                </div>
                <p>${user.usuario} | ${user._id}</p>
                <div class="input-adm">
                    <input type="checkbox" 
                           class="checkbox-admin"
                           id="adm_${user._id}" 
                           data-id="${user._id}" 
                           value="True" 
                           ${ehAdmin}>
                    <label for="adm_${user._id}">Esse usuário é um Administrador do sistema?</label>
                </div>
                <a class="link-editar" data-id="${user._id}" href="javascript:void(0)">
                    <button id="btnEditar" class="btn-editar">Editar Usuário</button>
                </a>
            </div>
            `;  
        });

        usuarios.insertAdjacentHTML('beforeend', estruturaHTML);

        const btnEditar = document.querySelectorAll('.link-editar')

        btnEditar.forEach(botao => {
            botao.addEventListener('click', (evento) => {
                event.preventDefault();
                const idUsuario = botao.getAttribute('data-id');
                sessionStorage.setItem("abaAberta", "gerenciador");
                window.location.replace(`../views/editarUser.html?id=${idUsuario}`);
    });
});

    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
    }
}

listarTodos();

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

usuarios.addEventListener('change', function(evento) {
    
    if (evento.target.classList.contains('checkbox-admin')) {
        
        const idDoUsuario = evento.target.getAttribute('data-id');
        
        const estaMarcado = evento.target.checked;
        
        atualizarStatusAdmin(idDoUsuario, estaMarcado);
    }
});

btn_gerenciador.addEventListener("click", function(event) {
    event.preventDefault();

    inicio.classList.add("hidden");
    gerenciador.classList.remove("hidden");
});
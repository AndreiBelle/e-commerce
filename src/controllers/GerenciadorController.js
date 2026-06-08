import GerenUsuarios from "../models/User.js";
import { toast } from "../utils/notificacao.js";

const usuarios = document.getElementById("usuarios");
const inicio = document.getElementById("inicio");
const gerenciador = document.getElementById("gerenciador");
const btn_gerenciador = document.getElementById('btn-gerenciador');

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
                    <img src="../../public/perfil.png" style="height: 150px;">
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
            </div>
            `;  
        });

        usuarios.insertAdjacentHTML('beforeend', estruturaHTML);

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
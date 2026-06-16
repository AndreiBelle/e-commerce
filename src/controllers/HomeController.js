import { toast } from "../utils/notificacao.js";


const areaDeslogado = document.getElementById("area-deslogado");
const areaLogadoAdm = document.getElementById("area-adm");
const areaLogadoUser = document.getElementById("area-usuario");
const textoAdm = document.getElementById("bem-vindo");
const textoUsuario = document.getElementById("bem-vindo-user");
const btnSairADM = document.getElementById("btn-sairADM")
const btnSair = document.getElementById("btn-sair");
const botoesExpansiveis = document.querySelectorAll('.btn-expansivel');




function gerenciarEstadoLogin() {
    const dadosUsuarioString = localStorage.getItem('usuarioLogado');
    const dadosIsAdmin = localStorage.getItem('isAdmin');

    if (dadosUsuarioString && dadosUsuarioString !== "undefined") {

    if (dadosUsuarioString) {
        try {
            const usuario = JSON.parse(dadosUsuarioString);
            const isAdmin = JSON.parse(dadosIsAdmin); 
            const nomeExibicao = usuario.usuario || "NÃO ENCONTRADO";

            if (textoAdm || textoUsuario) {
                textoAdm.textContent = `Olá, ${nomeExibicao} 👋`;
                textoUsuario.textContent = `Olá, ${nomeExibicao} 👋`;
            }

            if (areaDeslogado) {
                areaDeslogado.classList.add("hidden");
            }

            if (isAdmin === true) {
                if (areaLogadoAdm) areaLogadoAdm.classList.remove("hidden");
                if (areaLogadoUser) areaLogadoUser.classList.add("hidden");
            } else {
                if (areaLogadoUser) areaLogadoUser.classList.remove("hidden");
                if (areaLogadoAdm) areaLogadoAdm.classList.add("hidden");
            }

        } catch (erro) {
            console.error("Erro ao ler dados do localStorage:", erro);
            fazerLogout();
        }
    }
    } else {
        if (areaDeslogado) areaDeslogado.classList.remove("hidden");
        if (areaLogadoUser) areaLogadoUser.classList.add("hidden");
        if (areaLogadoAdm) areaLogadoAdm.classList.add("hidden");
    }
}

function fazerLogout() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('carrinho');
    window.location.reload();

}


if (btnSair) {
    btnSair.addEventListener("click", fazerLogout)
    
}
if (btnSairADM) {
    btnSairADM.addEventListener("click", fazerLogout)
}

botoesExpansiveis.forEach(botao => {
    botao.addEventListener('click', function (evento) {
        evento.stopPropagation();
        const subMenu = this.nextElementSibling;
        subMenu.classList.toggle('ativa');
    });
});

document.addEventListener('click', function () {
    document.querySelectorAll('.sub-menu').forEach(menu => {
        menu.classList.remove('ativa');
    });
});

gerenciarEstadoLogin();

import GerenUsuarios from "../models/User.js"
import { toast } from "../utils/notificacao.js";


const formulario = document.getElementById('CadastroForm');

async function Cadastrar(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await GerenUsuarios.Cadastrar(usuario, email, senha);

        if (resposta.sucesso === true ) {
            toast("Salvo com sucesso", "sucesso");
            setTimeout(() => {
                window.location.replace("../views/login.html")
            },1200)
            
        } else {
            toast("Erro!: "+resposta.mensagem, "erro")
        }
        
    } catch (err) {
        toast("Erro ao salvar: " +err.message, "erro");
    }
}

formulario.addEventListener('submit', Cadastrar);


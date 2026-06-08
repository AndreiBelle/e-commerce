import GerenUsuarios from "../models/User.js"
import { toast } from "../utils/notificacao.js";


const formulario = document.getElementById('CadastroForm');

async function Cadastrar(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        await GerenUsuarios.Cadastrar(usuario, email, senha);
        toast("Salvo com sucesso", "sucesso");
        window.location.replace("../views/login.html")
    } catch (err) {
        toast("Erro ao salvar: " +err.message, "erro");
    }
}

formulario.addEventListener('submit', Cadastrar);


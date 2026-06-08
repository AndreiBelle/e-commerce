import GerenUsuarios from "../models/User.js"
import { toast } from "../utils/notificacao.js";


const formulario = document.getElementById("loginForm")


async function Login(event) {
    event.preventDefault();

    const usuarioDigitado = document.getElementById("usuario").value;
    const senhaDigitada = document.getElementById("senha").value;

    try{
       const resultado = await GerenUsuarios.VerificaLogin(usuarioDigitado, senhaDigitada);

       if(resultado.ok) {
            localStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));
            localStorage.setItem('isAdmin', JSON.stringify(resultado.usuario.isAdmin));
            toast("Bem vindo, "+resultado.usuario.usuario+"!", "sucesso")

            setTimeout(() => {
                window.location.replace("../views/index.html");
            }, 1500)
       } else {
        toast(resultado.mensagem,"erro")
       } 
    } catch (err) {
        toast("Usuario não cadastrado!", "erro") 
       }

}

formulario.addEventListener('submit', Login);
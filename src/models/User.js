import db from "../database/db.js";

const GerenUsuarios = {
    Cadastrar: async (usuario, email, senha) => {
        try {
            const user = {
            _id: email.toLowerCase(),
            usuario: usuario,
            senha: senha,
            isAdmin: false
        }
        
        await db.put(user)

        return { sucesso: true, mensagem: "Usuario cadastrado"}
        } catch (err) {
            console.error("Erro ao cadastrar: "+ err)
            throw new Error("Falha no banco de dados")
        }
    },

    VerificaLogin: async (usuarioDigitado, senhaDigitada) => {
    try {
        const result = await db.allDocs({ include_docs: true });
        
        const uDig = usuarioDigitado.trim();
        const sDig = senhaDigitada.trim();

        const user = result.rows.find(u => u.doc.usuario.toLowerCase() === uDig.toLowerCase())?.doc;


        if (!user) {
            return { ok: false, mensagem: "Usuário não encontrado." };
        }

        if (user.senha === sDig) {
            return { ok: true, usuario: user };
        } else {
            return { ok: false, mensagem: "Usuário ou senha incorretos." };
        }
    } catch (err) {
        console.error("Erro no login:", err);
        return { ok: false, mensagem: "Erro interno." };
    }
},

   listarUsuarios: async function() {
        try {
            const resultado = await db.allDocs({ include_docs: true });
            return resultado; 

        } catch (erro) {
            console.error("Erro banco de dados:", erro);
            throw erro; 
        }
    },

    atualizarPermissao: async function(idDoUsuario, novoStatus) {
        try {

            const usuario = await db.get(idDoUsuario);
            
            usuario.isAdmin = novoStatus;
            
            const resposta = await db.put(usuario);
            
            return resposta; 

        } catch (erro) {
            console.error("Erro ao atualizar no banco de dados:", erro);
            throw erro;
        }
    }
};

export default GerenUsuarios;
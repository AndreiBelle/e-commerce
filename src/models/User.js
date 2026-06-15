import { db } from "../database/db.js";

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

   listarUsuarios: async () => {
        try {
            const resultado = await db.allDocs({ include_docs: true });
            return resultado; 

        } catch (erro) {
            console.error("Erro banco de dados:", erro);
            throw erro; 
        }
    },

    atualizarPermissao: async (idDoUsuario, novoStatus) => {
        try {

            const usuario = await db.get(idDoUsuario);
            
            usuario.isAdmin = novoStatus;
            
            const resposta = await db.put(usuario);
            
            return resposta; 

        } catch (erro) {
            console.error("Erro ao atualizar no banco de dados:", erro);
            throw erro;
        }
    },

    buscarUser: async function(id) {
        try {
            const dados = await GerenUsuarios.listarUsuarios();

            const userFiltrado = dados.rows.filter(linha => {
            const filtro = linha.doc;

            return filtro._id === id;
        })

        return userFiltrado.map(linha => linha.doc);
        } catch (err) {
            console.error("Erro ao buscar ID!" + err)
            return [];
        }
    },

    editarUser: async function(idAntigo, novoEmail, validaEmail, novoUsuario) {
    try {
        if (idAntigo !== validaEmail) {
            throw new Error("Credenciais inválidas para edição.");
        }

        const documentoAntigo = await db.get(idAntigo);
        const idNovo = novoEmail.toLowerCase();

        if (idAntigo !== idNovo) {
            try {
                await db.get(idNovo);
                return { sucesso: false, mensagem: "Erro: Este e-mail já está em uso por outra pessoa!" };
                
            } catch (erroBusca) {
                if (erroBusca.status) {
                    const novoDocumento = {
                        _id: idNovo,
                        usuario: novoUsuario,
                        senha: documentoAntigo.senha,
                        isAdmin: documentoAntigo.isAdmin
                    };

                    await db.remove(documentoAntigo);
                    await db.put(novoDocumento);

                    return { sucesso: true, mensagem: "E-mail e dados atualizados com sucesso!" };
                } else {
                    throw erroBusca; 
                }
            }

        } else {
            documentoAntigo.usuario = novoUsuario;
            await db.put(documentoAntigo);
            
            return { sucesso: true, mensagem: "Nome atualizado com sucesso!" };
        }

        } catch (erro) {
            console.error('Erro ao atualizar o usuário: ', erro);
            
            return { 
                sucesso: false, 
                mensagem: erro.message === "Credenciais inválidas para edição." ? erro.message : "Falha ao modificar o banco de dados." 
            };
        }
    },  

    excluirUser: async (id) => {
        try {
           const dados = await db.get(id);

           await db.remove(dados);
           
           return { sucesso: true, mensagem: "Usuário excluído com sucesso!" };

        } catch (err) {
        console.error("Erro ao remover usuario ",err)
        console.log(id);
        return {sucesse: false, mensagem: "Falha ao excluir usuario"}
        }
    }
}
export default GerenUsuarios;
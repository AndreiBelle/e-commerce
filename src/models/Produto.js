import {dbProdutos} from "../database/db.js";

const GerenProdutos = {
    
    CadastrarProduto: async (titulo, valor, descricao, imagemUrl, categoria) => {
        try {
            
            const produto = {
                _id: "prod_" + Date.now(), 
                tipo: "produto", 
                titulo: titulo,
                valor: valor,
                descricao: descricao,
                imagem: imagemUrl,
                categoria: categoria, 
            };

            await dbProdutos.put(produto);

            return { ok: true, mensagem: "Produto publicado com sucesso na loja!" };

        } catch (erro) {
            console.error("Erro ao salvar produto:", erro);
            return { ok: false, mensagem: "Falha ao conectar com o banco de dados." };
        }
    },

    buscarTodos: async () => {
        try {
            const resultado = await dbProdutos.allDocs({ include_docs: true });
        return resultado;

        } catch (erro) {
            console.error("Erro ao buscar produtos:", erro);
            return []; 
        }
    },

    BuscarPorCategoria: async (categoriaClicada) => {
        try {
            const resultado = await db.allDocs({ include_docs: true });
            
            const produtosFiltrados = resultado.rows.filter(linha => {
                const ficha = linha.doc;
                

                return ficha.tipo === "produto" && ficha.categoria === categoriaClicada;
            });

            return produtosFiltrados.map(linha => linha.doc);

        } catch (erro) {
            console.error("Erro ao buscar produtos na categoria:", erro);
            return []; 
        }
    }
};

export default GerenProdutos;
import {dbProdutos} from "../database/db.js";

const GerenProdutos = {
    
    CadastrarProduto: async (titulo, valor, descricao, imagemUrl, categoria, quantidade) => {
        try {
            function criaProduto(id) {
                id = 0;
                id++
                const produto = {
                    _id: id, 
                    tipo: "produto", 
                    titulo: titulo,
                    valor: valor,
                    descricao: descricao,
                    imagem: imagemUrl,
                    categoria: categoria, 
                };
                return produto
            } 

            await db.put(criaProduto(id));

            return { ok: true, mensagem: "Produto publicado com sucesso na loja!" };

        } catch (erro) {
            console.error("Erro ao salvar produto:", erro);
            return { ok: false, mensagem: "Falha ao conectar com o banco de dados." };
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
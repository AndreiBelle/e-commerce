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
            const resultado = await dbProdutos.allDocs({ include_docs: true });
            
            const produtosFiltrados = resultado.rows.filter(linha => {
                const ficha = linha.doc;
                

                return ficha.tipo === "produto" && ficha.categoria === categoriaClicada;
            });

            return produtosFiltrados.map(linha => linha.doc);

        } catch (erro) {
            console.error("Erro ao buscar produtos na categoria:", erro);
            return []; 
        }
    },

    BuscarPesquisa: async (valorDigitado) => {
        try {
            const resultado = await dbProdutos.allDocs({ include_docs: true });
            
            const produtosFiltrados = resultado.rows.filter(linha => {
                const ficha = linha.doc;
                
                
                if (ficha.tipo !== "produto") {
                    return false;
                }
                
                
                const titulo = (ficha.titulo || "").toLowerCase();
                const descricao = (ficha.descricao || "").toLowerCase();
                const valorPesquisado = valorDigitado.toLowerCase();
                
                const tituloFiltro = titulo.includes(valorPesquisado);
                
                const descricaFiltro = descricao.includes(valorPesquisado);
                
                return tituloFiltro || descricaFiltro;
            });

            return produtosFiltrados.map(linha => linha.doc);

        } catch (erro) {
            console.error("Erro ao buscar produtos na pesquisa:", erro);
            return []; 
        }
    },

    excluirProduto: async (id) => {
        try {
           const dados = await dbProdutos.get(id);

           await dbProdutos.remove(dados);
           
           return { sucesso: true, mensagem: "Produtos excluído com sucesso!" };

        } catch (err) {
        console.error("Erro ao remover produto ",err)
        console.log(id);
        return {sucesse: false, mensagem: "Falha ao excluir produto"}
        }
    }
};

export default GerenProdutos;
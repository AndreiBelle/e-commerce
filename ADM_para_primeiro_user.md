# Olá, para se tornar ADM no primeiro usuário criado precisa mandar esse comando no console no navegador (F12), não precisa estar logado e foi deixado de forma proposital o “window” no model para poder alterar via console (não sendo uma boa prática de segurança, mas foi apenas pro trabalho).

## OBS: alterar o user@email.com para o e-mail que você utilizou ao cadastrar o seu usuário.

const db = new PouchDB('usuarios');
db.get("user@email.com").then(function (doc) { 
    console.log("documento encontrado: ", doc)
    doc.isAdmin = true;
    return db.put(doc);
}).then(function(response){
    console.log("Atualizado com sucesso!", response);
}).catch(function(err) {
    console.log("erro na atualização>", err);
})

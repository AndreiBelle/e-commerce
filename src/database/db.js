const db = new PouchDB('usuarios');
const dbProdutos = new PouchDB('produtos');
const remoteCouch = false;

window.usuarios = db;
window.dbProdutos = dbProdutos;

export {db, dbProdutos};
const db = new PouchDB('usuarios');
const remoteCouch = false;

window.usuarios = db;

export default db;
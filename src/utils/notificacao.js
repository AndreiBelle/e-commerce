
const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    dismissible: true, 
    types: [
        { type: 'sucesso', background: '#10b981' }, 
        { type: 'erro', background: '#ef4444' }   
    ]
});

export function toast(mensagem, tipo = 'sucesso') {
    
    notyf.open({
        type: tipo,
        message: mensagem
    });
}
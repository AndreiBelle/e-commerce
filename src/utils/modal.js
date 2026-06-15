export async function modalExcluir() {
        const resposta = await Swal.fire({
        title: 'Tem certeza?',
        text: "Essa ação não poderá ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6', 
        cancelButtonColor: '#d33',     
        confirmButtonText: 'Sim, excluir usuário!',
        cancelButtonText: 'Cancelar'
    });

    return resposta;
}
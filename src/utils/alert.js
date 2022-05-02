import Swal from "sweetalert2";

export function successAlert(title='Sucesso', text='', callback=()=>{}){
    Swal.fire({
        title: title,
        html: text,
        position: 'center',
        icon: 'success',
        timer: 1000,
        timerProgressBar: true,
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            callback()
        }
        else{
            callback()
        }
        
    })
}

export function confirmAlert(title='Tem certeza?', text='',isConfirmed=()=>{}, isDenied = ()=>{}){
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#f44336',
        confirmButtonText: 'Sim!'
    }).then((result) => {
        if (result.isConfirmed) {
            isConfirmed()
        }
        else{
            isDenied()
        }

    })
}

export function infoAlert(title='Atenção', text='', callback=()=>{}){
    Swal.fire({
        title: title,
        html: text,
        position: 'center',
        icon: 'info',
        timer: 3000,
        timerProgressBar: true,
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            callback()
        }
    })
}

export function errorAlert(title='Erro', text='',callback=()=>{}){
    Swal.fire({
        title: title,
        html: text,
        position: 'center',
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            callback()
        }
    })
}


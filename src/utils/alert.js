import Swal from "sweetalert2";

export function successAlert(
  title = "Sucesso",
  text = "",
  callback = () => {}
) {
  Swal.fire({
    title: title,
    html: text,
    position: "center",
    icon: "success",
    timer: 1000,
    timerProgressBar: true,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      callback();
    } else {
      callback();
    }
  });
}

export function confirmAlert(
  title = "Tem certeza?",
  text = "",
  isConfirmed = () => {},
  isDenied = () => {}
) {
  Swal.fire({
    title: title,
    html: text,
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3f51b5",
    cancelButtonColor: "#f44336",
    confirmButtonText: "Sim!",
  }).then((result) => {
    if (result.isConfirmed) {
      isConfirmed();
    } else {
      isDenied();
    }
  });
}

export function infoAlert(title = "Atenção", text = "", callback = () => {}) {
  Swal.fire({
    title: title,
    html: text,
    position: "center",
    icon: "info",
    timer: 4000,
    timerProgressBar: true,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      callback();
    }
  });
}

export function errorAlert(title = "Erro", text = "", callback = () => {}) {
  Swal.fire({
    title: title,
    html: text,
    position: "center",
    icon: "error",
    timer: 15000,
    timerProgressBar: true,
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      callback();
    }
  });
}

export async function textAreaAllert(title = 'Observaçãoes', placeholder='Digite aqui...') {
  const { value: text } = await Swal.fire({
    input: "textarea",
    inputLabel: title,
    inputPlaceholder: placeholder,
    inputAttributes: {
      "aria-label": "Digite sua mensagem aqui",
    },
    showCancelButton: true,
    confirmButtonText: "Enviar",
    confirmButtonColor: "#3f51b5",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#f44336",
  });

  if (text) {
    // Swal.fire(text);
    return text;
  }
  else{
    throw null; 
  }
}

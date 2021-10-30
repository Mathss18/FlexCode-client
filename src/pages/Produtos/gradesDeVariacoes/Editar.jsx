import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Divider, Button } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import api from "../../../services/api";
import Swal from "sweetalert2";



const initialValues = {
  nome: "",
  sigla: "",
  padrao: 0,
};

function EditarVariacoes() {
  const history = useHistory();
  const [values, setValues] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    api.get("/tipo-variacao-produto/" + id).then((response) => {
      api.get("/nomes-variacoes-produtos").then(res => {
         res.data.data.find(id_variacao => {
          if(response.data.id == id_variacao.tipo_variacao_produto_id) {
            setValues(id_variacao.data);
          }
        })
      })
    });
  }, []);


  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleOnSubmit(event) {
    event.preventDefault();
    api
      .put("/grupo-produto/" + id, values)
      .then((response) => {
        console.log(response);
        Swal.fire({
          title: "Atualizado com sucesso!",
          html: "Redirecionando...",
          position: "top-end",
          icon: "success",
          timer: 1800,
          timerProgressBar: true,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            history.push("/grupos-produtos");
          }
        });
      })
      .catch((error) => {
        console.log(error.response.request.responseText);
        Swal.fire({
          title: "Erro ao atualizar!",
          html: error.response.data.message,
          position: "top-end",
          icon: "error",
          timer: 10000,
          timerProgressBar: true,
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            //history.push("/clientes")
          }
        });
      });
  }

  function handleDelete() {
    Swal.fire({
      title: "Tem certeza?",
      text: "Isso será irreversivel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3f51b5",
      cancelButtonColor: "#f44336",
      confirmButtonText: "Sim, excluir!",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .delete("/grupo-produto/" + id)
          .then((result) => {
            Swal.fire("Excluido!", "Cliente excluido com sucesso.", "success");
            history.push("/grupos-produtos");
          })
          .catch((error) => {
            console.log(error.response.request.responseText);
            Swal.fire({
              title: "Erro ao excluir!",
              html: error.response.data.message,
              position: "top-end",
              icon: "error",
              timer: 10000,
              timerProgressBar: true,
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                //history.push("/clientes")
              }
            });
          });
      }
    });
  }

  return (
    <>
      <TopBar />

      <SideMenu>
        <div>
          <Divider />
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <AssignmentIcon />
            <h3>Dados Da Unidade de Produto</h3>
          </div>
          {/* <form onSubmit={handleOnSubmit}>
          <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField variant="outlined" label="Nome" fullWidth type="text" value={values.nome} name="nome" onChange={handleOnChange} />
              </Grid>
              <Grid item xs={3}>
                <TextField variant="outlined" label="Sigla" fullWidth type="text" value={values.sigla} name="sigla" onChange={handleOnChange} />
              </Grid>
              <Grid item xs={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Padrão</InputLabel>
                  <Select className={'input-select'} label="Padrão" onChange={handleOnChange} type="select" name="padrao" value={values.padrao}>
                    <MenuItem value={0}>Não</MenuItem>
                    <MenuItem value={1}>Sim</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Divider />

            <Grid container spacing={0}>
              <Grid item>
                <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={'btn btn-primary btn-spacing'}>
                  Salvar
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" startIcon={<DeleteForeverIcon />} className={'btn btn-error btn-spacing'} onClick={handleDelete}>
                  Excluir
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => history.push("/clientes")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form> */}
        </div>
      </SideMenu>
    </>
  );
}

export default EditarVariacoes;

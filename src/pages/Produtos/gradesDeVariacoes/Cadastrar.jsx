import { useState } from "react";
import { Grid, TextField, Divider, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { gradeVariacoesValidation } from "../../../validators/validationSchema";
import { useFormik } from "formik";
import { infoAlert, successAlert } from "../../../utils/alert";

const initialValues = {
  nome: "",
  variacoes: ["", ""],
};

function CadastrarVariacoes() {
  const history = useHistory();
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: gradeVariacoesValidation,

  })

  const handleOnChange = (e) => {
    let { name, value, id } = e.target;

    if (name === "variacoes") {
      const index = id.split("_")[1];
      const newVariacoes = [...formik.values.variacoes];
      newVariacoes[index] = value;
      console.log(newVariacoes);
      formik.setValues({ ...formik.values, variacoes: newVariacoes });
    } else {
      formik.setValues({ ...formik.values, [name]: value });
    }
  };

  const AdicionarVariacao = () => {
    const newVariacoes = [...formik.values.variacoes];
    newVariacoes.push("");
    formik.setValues({ ...formik.values, variacoes: newVariacoes });
  };

  const removerVariacao = (i) => {
    const newVariacoes = [...formik.values.variacoes];
    newVariacoes.splice(i, 1);
    formik.setValues({ ...formik.values, variacoes: newVariacoes });
  };

  console.log(formik.values);

  function handleOnSubmit(values) {

    api.post("/tipo-variacao-produto", { nome: formik.values.nome })
      .then((res) => {
        successAlert("Sucesso", "Variação de Produto Cadastrada", () =>
          history.push("/grades-variacoes")
        );
        formik.values.variacoes.forEach((variacao) => {
          api.post("/nome-variacao-produto", {
            nome: variacao,
            tipo_variacao_produto_id: res.data.data.id,
            tipo_variacao_produto: res.data.data
          }).catch((error) => {
            infoAlert("Atenção", error.response.data.message);
          });
        });
      }).catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      });
  }

  return (
    <>
      <div>
        <Divider />
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <AssignmentIcon />
          <h3>Dados da Unidade de Produtos</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField variant="outlined"
                label="Nome" fullWidth
                type="text"
                name="nome"
                value={formik.values.nome}
                onChange={handleOnChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome} />
            </Grid>
            {formik.values.variacoes.map((variacao, index) => {
              return (
                <Grid item xs={2} key={index}>
                  <TextField
                    variant="outlined"
                    label={"Variação " + (index + 1)}
                    fullWidth
                    id={"variacoes_" + index}
                    value={variacao}
                    name="variacoes"
                    onChange={handleOnChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.variacoes && Boolean(formik.errors.variacoes)}
                    helperText={formik.touched.variacoes && formik.errors.variacoes}
                    InputProps={
                      index !== 0 && {
                        endAdornment: (
                          <IconButton onClick={() => removerVariacao(index)}>
                            <DeleteIcon />
                          </IconButton>
                        ),
                      }
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
          <Grid>
            <Button className={"btn btn-primary btn-spacing"} variant="outlined" onClick={() => AdicionarVariacao()}>
              Adicionar
            </Button>
          </Grid>
          <br />
          <Divider />

          <Grid container spacing={0}>
            <Grid item>
              <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={"btn btn-primary btn-spacing"}>
                Salvar
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => history.push("/grades-variacoes")} variant="outlined" startIcon={<CloseIcon />} className={"btn btn-error btn-spacing"}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default CadastrarVariacoes;

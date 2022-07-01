import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../config/tablesConfig";
import { Tooltip } from "@material-ui/core";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { ajusteEstoqueValidation } from "../../validators/validationSchema";
import { confirmAlert, errorAlert, successAlert } from "../../utils/alert";
const empresaConfig = JSON.parse(localStorage.getItem("config"));

const initialValues = {
  quantidade: "",
  valorUnitario: "",
  tipo: 1,
  observacao: "",
};

function ListarEstoques() {
  const history = useHistory();
  const [produtos, setProdutos] = useState([]);
  const [selectedEstoque, setSelectedEstoque] = useState({});
  const fullScreenLoader = useFullScreenLoader();
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: ajusteEstoqueValidation,
  });
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Código Interno",
      options: rowConfig,
    },
    {
      name: "Grupo",
      options: rowConfig,
    },
    {
      name: "Valor Custo",
      options: rowConfig,
    },
    {
      name: "Estoque",
      options: rowConfig,
    },
    // {
    //   name: "Cliente",
    //   options: rowConfig,
    // },
    // {
    //   name: "Fornecedores",
    //   options: rowConfig,
    // },
    {
      name: "Cadastrado em",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/estoques/movimentacoes/" + id);
  }

  function handleClickAjusteManual(event, element) {
    formik.resetForm();
    formik.setFieldValue("valorUnitario", element?.produto?.custoFinal)
    setSelectedEstoque(element);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  function handleOnSubmit() {
    if (
      formik.values.quantidade > selectedEstoque.quantidade &&
      formik.values.tipo === 1
    ) {
      handleClose();
      confirmAlert(
        "Atenção - Estoque Negativo!",
        "Você está retirando uma quantidade maior de produto do que há no estoque." +
          "<br>" +
          "<b>Deseja realmente continuar?</b>",
        () => {
          ajustarEstoque();
        },
        () => {
          setOpen(true);
          formik.setSubmitting(false);
        }
      );
    } else {
      ajustarEstoque();
    }
  }

  function ajustarEstoque() {
    api
      .post("/estoques/ajustar", {
        ...formik.values,
        produto_id: selectedEstoque.produto.id,
        quantidadeAtual: selectedEstoque.quantidade,
      })
      .then((response) => {
        setOpen(false);
        successAlert("Sucesso", "Estoque ajustado com sucesso!");
      })
      .catch((error) => {
        setOpen(false);
        errorAlert("Erro", "Erro ao ajustar estoque!");
      })
      .finally(() => formik.setSubmitting(false));
  }

  useEffect(() => {
    if (formik.isSubmitting) return;
    fullScreenLoader.setLoading(true);
    api
      .get("/estoques")
      .then((response) => {
        response.data["data"].forEach((element) => {
          var array = [
            element.produto.nome,
            element.produto.codigoInterno,
            element.produto.grupo_produto.nome,
            `R$: ${element.produto["valorCusto"].toFixed(
              empresaConfig.quantidadeCasasDecimaisValor
            )}`,
            `${element["quantidade"]} ${
              element.produto.unidade_produto?.sigla ?? ""
            }`,
            // element.produto?.cliente?.nome,
            // element.produto["fornecedores"].map((item, index) => {
            //   if (element.produto["fornecedores"].length > 3) {
            //     let string = "";
            //     if (index < 3) {
            //       string += item["nome"] + ", ";
            //       if (index === 2) {
            //         string +=
            //           "... + " +
            //           (element["fornecedores"].length - 3) +
            //           " fornecedores";
            //       }
            //       return string;
            //     }
            //   } else {
            //     return item["nome"] + ", ";
            //   }
            // }),
            new Date(element["created_at"]).toLocaleString(),
            <>
              <Tooltip title={"Movimentações"} arrow>
                <CompareArrowsIcon
                  className={"btn btn-lista"}
                  onClick={(event) =>
                    handleOnClickShowButton(event, element["produto_id"])
                  }
                />
              </Tooltip>
              <Tooltip title={"Ajuste Manual"} arrow>
                <AutoFixHighIcon
                  className={"btn btn-lista"}
                  onClick={(event) => handleClickAjusteManual(event, element)}
                />
              </Tooltip>
            </>,
          ];
          data.push(array);
        });

        setProdutos(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, [formik.isSubmitting]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogTitle className="dialogBackground dialogTitle">
          <b>Ajuste de estoque manual - {selectedEstoque?.produto?.nome}</b>
        </DialogTitle>
        <DialogContent className="dialogBackground">
          <DialogContentText className="dialogTitle">
            Utilize este formulário para ajustar o estoque de um produto.
          </DialogContentText>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  label={"Quantidade *"}
                  placeholder={`Quantidade em estoque: ${
                    selectedEstoque.quantidade
                  } ${selectedEstoque?.produto?.unidade_produto?.sigla ?? ""}`}
                  fullWidth
                  type="number"
                  value={formik.values.quantidade}
                  name="quantidade"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.quantidade &&
                    Boolean(formik.errors.quantidade)
                  }
                  helperText={
                    formik.touched.quantidade && formik.errors.quantidade
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  label="Valor Unitário *"
                  placeholder={`Valor atual: R$: ${selectedEstoque?.produto?.custoFinal.toFixed(
                    empresaConfig.quantidadeCasasDecimaisValor
                  )}`}
                  fullWidth
                  type="number"
                  value={formik.values.valorUnitario}
                  name="valorUnitario"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.valorUnitario &&
                    Boolean(formik.errors.valorUnitario)
                  }
                  helperText={
                    formik.touched.valorUnitario && formik.errors.valorUnitario
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl variant="outlined" fullWidth name="tipo">
                  <InputLabel>Tipo *</InputLabel>
                  <Select
                    className={"input-select"}
                    label="Tipo *"
                    name="tipo"
                    value={formik.values.tipo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                  >
                    <MenuItem value={0}>Entrada</MenuItem>
                    <MenuItem value={1}>Saída</MenuItem>
                  </Select>
                  {formik.touched.tipo && Boolean(formik.errors.tipo) ? (
                    <FormHelperText>{formik.errors.tipo}</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginTop: 8 }}>
              <Grid item xs={12}>
                <TextField
                  multiline
                  className={"input-select"}
                  variant="outlined"
                  label="Observação do Ajuste *"
                  placeholder={"Descreva o motivo do ajuste"}
                  fullWidth
                  value={formik.values.observacao}
                  rows={5}
                  name="observacao"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.observacao &&
                    Boolean(formik.errors.observacao)
                  }
                  helperText={
                    formik.touched.observacao && formik.errors.observacao
                  }
                />
              </Grid>
            </Grid>

            <br />
            <Divider />

            <Grid container spacing={0}>
              <div style={{ marginLeft: "auto", display: "flex" }}>
                <Grid item>
                  <Button
                    type="submit"
                    variant="outlined"
                    startIcon={<CheckIcon />}
                    className={"btn btn-primary btn-spacing"}
                    disabled={formik.isSubmitting}
                  >
                    Salvar
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    className={"btn btn-error btn-spacing"}
                    disabled={formik.isSubmitting}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </div>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      <MUIDataTable
        title={"Lista de Produtos em estoque"}
        data={produtos}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarEstoques;

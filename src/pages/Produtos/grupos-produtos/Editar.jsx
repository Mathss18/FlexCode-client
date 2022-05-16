import { useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Button,
  FormHelperText,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import api from "../../../services/api";
import { grupoProdutoValidation } from "../../../validators/validationSchema";
import { useFormik } from "formik";
import { confirmAlert, errorAlert, successAlert } from "../../../utils/alert";
import MUIDataTable from "mui-datatables";
import toast from "react-hot-toast";

const initialValues = {
  nome: "",
  grupoPai: -1,
  porcentagemLucro: -1,
};

const columns = [
  {
    name: "descricao",
    label: "Descrição",
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: "porcentagem",
    label: "Porcentagem",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return value + "%";
      },
    },
  },
];

function EditarGruposDeProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const [porcentagensLucros, setPorcentagensLucros] = useState([]);
  const selectedRows = useRef([]);
  const { id } = useParams();
  const [itensSelected, setItensSelected] = useState([]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => {
      handleOnSubmit(event);
    },
    validationSchema: grupoProdutoValidation,
  });

  useEffect(() => {
    api
      .get("/grupos-produtos")
      .then((response) => {
        setGrupos(response.data["data"]);
      })
      .catch((error) => {
        console.log("Erro:" + error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/grupos-produtos/" + id)
      .then((response) => {
        formik.setValues(response.data["data"]);
      })
      .catch((error) => {
        console.log("Erro:" + error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/porcentagens-lucros")
      .then((response) => {
        setPorcentagensLucros(response.data["data"]);
      })
      .catch((err) => {
        console.log("Erro:" + err);
      });
  }, []);

  useEffect(() => {
    selectedRows.current = [];

    porcentagensLucros.forEach((item, index) => {
      formik.values.porcentagem_lucro.forEach((element, i) => {
        if (item.id == element.id) {
          setItensSelected((prevState) => [...prevState, index]);
          selectedRows.current.push(item);
        }
      });
    });
  }, [porcentagensLucros]);

  function handleOnSubmit(values) {
    if (selectedRows.current.length === 0) {
      toast.error(
        "Selecione pelo menos uma porcentagem de lucro para associar ao grupo de produto."
      );
      return;
    }
    console.log(selectedRows.current);
    values.porcentagensLucros = selectedRows.current;

    api
      .put("/grupos-produtos/" + id, values)
      .then((response) => {
        successAlert("Sucesso", "Grupo de Produto Editado", () =>
          history.push("/grupos-produtos")
        );
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => formik.setSubmitting(false));
  }

  const options = {
    expandableRowsHeader: false,
    print: false,
    download: false,
    filter: false,
    selectableRows: "multiple",
    selectToolbarPlacement: "none",
    selectableRowsHeader: false,
    rowsSelected: itensSelected,
    search: false,
    viewColumns: false,
    pagination: true,
    textLabels: {
      body: {
        noMatch: "Nenhum resultado encontrado.",
      },
    },
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      handleRowSelect(allRowsSelected);
    },
    setRowProps: (row, dataIndex, rowIndex) => {
      return {
        className: rowIndex % 2 == 0 ? "row row-par" : "row row-impar",
        style: {
          fontSize: 30,
          color: "red",
        },
      };
    },
  };

  function handleDelete() {
    let gruposDependentes = grupos.filter((item) => item.grupoPai == id);
    let info =
      gruposDependentes.length > 0
        ? "\r\n Os seguintes ficarão sem grupo Pai:\r\n"
        : "";

    confirmAlert(
      "Tem certeza?" + info,
      gruposDependentes.map((element) => " " + element.nome),
      () => {
        deletarGrupoProduto();
      }
    );
  }

  function handleRowSelect(allRowsSelected) {
    selectedRows.current = [];
    let arr = [];
    allRowsSelected.forEach((element) => {
      selectedRows.current.push(porcentagensLucros[element.dataIndex]);
      arr.push(element.dataIndex);
    });
    setItensSelected(arr);
  }

  function deletarGrupoProduto() {
    api
      .delete("/grupos-produtos/" + id)
      .then((result) => {
        successAlert("Sucesso", "Grupo de Produto Excluido", () =>
          history.push("/grupos-produtos")
        );
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      });
  }

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Dados do Grupo de Produto</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Nome do Grupo"
                fullWidth
                type="text"
                name="nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
              <FormControl
                variant="outlined"
                fullWidth
                className={"input-select"}
                style={{ marginTop: 16 }}
              >
                <InputLabel id="label-grupo-pai">Grupo Pai</InputLabel>
                <Select
                  className={"input-select"}
                  label="Grupo pai"
                  name="grupoPai"
                  value={formik.values.grupoPai}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.grupoPai && Boolean(formik.errors.grupoPai)
                  }
                >
                  <MenuItem value={-1}>Nenhum</MenuItem>
                  {grupos &&
                    grupos.map((grupo) => {
                      return (
                        <MenuItem value={grupo.id} key={grupo.id}>
                          {grupo.nome}
                        </MenuItem>
                      );
                    })}
                </Select>
                {formik.touched.grupoPai && Boolean(formik.errors.grupoPai) ? (
                  <FormHelperText>{formik.errors.grupoPai}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <MUIDataTable
                title={"Porcentagens de Lucro"}
                data={porcentagensLucros}
                columns={columns}
                options={options}
                className={"table-background"}
              />
            </Grid>
          </Grid>
          <br />
          <Divider />

          <Grid container spacing={0}>
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
                variant="outlined"
                startIcon={<DeleteForeverIcon />}
                className={"btn btn-error btn-spacing"}
                disabled={formik.isSubmitting}
                onClick={handleDelete}
              >
                Excluir
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => history.push("/grupos-produtos")}
                variant="outlined"
                startIcon={<CloseIcon />}
                className={"btn btn-error btn-spacing"}
                disabled={formik.isSubmitting}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default EditarGruposDeProdutos;

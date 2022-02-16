import { useState, useEffect, useRef } from "react";
import { Grid, TextField, Select, Divider, Button, MenuItem, FormControl, InputLabel, FormHelperText } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { grupoProdutoValidation } from "../../../validators/validationSchema";
import { infoAlert, successAlert } from "../../../utils/alert";
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
      }
    },

  },
];




function CadastrarGrupoDeProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const [porcentagensLucros, setPorcentagensLucros] = useState([]);
  const selectedRows = useRef([]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },
    validationSchema: grupoProdutoValidation,
  })

  useEffect(() => {

    api.get("/grupos-produtos").then(response => {
      setGrupos(response.data['data']);
    }).catch(err => {
      console.log('Erro:' + err);
    });

  }, [])

  useEffect(() => {

    api.get("/porcentagens-lucros").then(response => {
      setPorcentagensLucros(response.data['data']);
    }).catch(err => {
      console.log('Erro:' + err);
    });

  }, [])

  function handleOnSubmit(values) {
    console.log(selectedRows.current.length);
    if (selectedRows.current.length === 0) {
      toast.error("Selecione pelo menos uma porcentagem de lucro para associar ao grupo de produto.")
      return;
    }
    values.porcentagensLucros = selectedRows.current;

    api.post("/grupos-produtos", values).then((response) => {
      successAlert("Sucesso", "Grupo de Produto Cadastrado", () =>
        history.push("/grupos-produtos")
      );

    })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      });
  }

  const options = {
    expandableRowsHeader: false,
    print: false,
    download: false,
    filter: false,
    selectableRows: "multiple",
    selectToolbarPlacement: "none",
    selectableRowsHeader: false,
    search: false,
    viewColumns: false,
    pagination: true,
    textLabels: {
      body: {
        noMatch: "Nenhum resultado encontrado.",
      },
    },
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => { handleRowSelect(allRowsSelected) },
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

  function handleRowSelect(allRowsSelected) {
    selectedRows.current = [];
    allRowsSelected.forEach(element => {
      selectedRows.current.push(porcentagensLucros[element.dataIndex]);
      console.log(selectedRows.current);
    })

  }

  return (
    <>
      <div>
        <Divider />
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <AssignmentIcon />
          <h3>Dados do Grupo de Produto</h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                label="Nome do Grupo"
                fullWidth type="text"
                name="nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
              <FormControl variant="outlined" fullWidth className={'input-select'} style={{marginTop: 16}}>
                <InputLabel id="label-grupo-pai">Grupo Pai</InputLabel>
                <Select
                  className={'input-select'}
                  label="Grupo pai"
                  name="grupoPai"
                  value={formik.values.grupoPai}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.grupoPai && Boolean(formik.errors.grupoPai)} >

                  <MenuItem value={-1}>
                    Nenhum
                  </MenuItem>
                  {grupos &&
                    grupos.map((grupo) => {
                      return <MenuItem value={grupo.id} key={grupo.id}>{grupo.nome}</MenuItem>
                    })}
                </Select>
                {formik.touched.grupoPai && Boolean(formik.errors.grupoPai)
                  ? <FormHelperText>{formik.errors.grupoPai}</FormHelperText>
                  : ''
                }
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <MUIDataTable
                title={"Porcentagens de Lucro"}
                data={porcentagensLucros}
                columns={columns}
                options={options}
                className={'table-background'}
              />
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
              <Button onClick={() => history.push("/grupos-produtos")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
}

export default CadastrarGrupoDeProdutos;

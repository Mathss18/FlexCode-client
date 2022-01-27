import { useState, useEffect, useRef } from "react";
import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import {
  Grid,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  Button,
  FormControlLabel,
  Tooltip,
} from "@material-ui/core";
import api from "../../../../services/api";
import MUIDataTable from "mui-datatables";
import CalculateIcon from "@mui/icons-material/Calculate";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { infoAlert, successAlert } from "../../../../utils/alert";
import HelpIcon from "@mui/icons-material/Help";

export function Valores() {
  const [porcentagemLucro, setPorcentagemLucro] = useState({
    descricao: "",
    porcentagem: 0,
    favorito: false,
  });
  const [openShowOnTable, setOpenShowOnTable] = useState(false); // Estado que armazena se o modal de criar nova porcentagem de lucro está aberto ou não
  const [porcentagensLucros, setPorcentagensLucros] = useState([]); // Lista de porcentagens de lucro
  const porcentagensLucrosAux = useRef([]); // Lista de porcentagens de lucro auxiliar
  const produtoContext = useProdutoContext();

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.useValues.setValues({...produtoContext.useValues.values,[name]: value}); // Altera o State
    produtoContext.formik.setFieldValue(name, value); // Altera o formik

    console.log(produtoContext.formik.values);
  }

  // Verifica se já há algum valor dentro to array de porcentagens de lucro, se não houver trás todas as porcentagens de lucro favoritas
  useEffect(() => {
    if(produtoContext.formik.values.valuesProfit.length > 0) return;
    api.get("/porcentagens-lucros").then((response) => {
      response.data["data"] = response.data["data"].filter((item) => item.favorito == true); // Filtra só os favoritos
      response.data["data"].map((item, index) => (item.isSelected = false)); // Atributo para saber se o item está selecionado
      response.data["data"].map((item, index) => (item.checkbox = (<Checkbox checked={item.isSelected} onClick={() => { addPorcentagemLucro(item, index); }} />))); // Coloca uma checkbox
      porcentagensLucrosAux.current = response.data["data"];  
      setPorcentagensLucros([...porcentagensLucrosAux.current]);
    });

  }, []);

  // Verifica se já há algum valor dentro to array de porcentagens de lucro, se não houver trás todas as porcentagens de lucro favoritas
  useEffect(() => {
    if(produtoContext.formik.values.valuesProfit.length <= 0) return;
      setPorcentagensLucros(produtoContext.formik.values.valuesProfit);
      porcentagensLucrosAux.current = produtoContext.formik.values.valuesProfit;


  }, []);


  function handleOnChangePorcentagemLucro(event) {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      console.log(checked);
      setPorcentagemLucro({
        ...porcentagemLucro,
        [name]: checked ? true : false,
      });
    } else {
      setPorcentagemLucro({ ...porcentagemLucro, [name]: value });
    }
  }

  function handleAddChangePorcentagemLucro(){
    handleClose();

    api
      .post("/porcentagem-lucro", porcentagemLucro)
      .then((response) => {
        successAlert("Sucesso", "Porcentagem de Lucro Cadastrada");
        setPorcentagemLucro({ descricao: "", porcentagem: 0, favorito: false }); // Reseta o formulário
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      });
  };

  function addPorcentagemLucro(item, index) {
    console.log(porcentagensLucros);
    porcentagensLucrosAux.current[index].isSelected = !porcentagensLucrosAux.current[index].isSelected;
    porcentagensLucrosAux.current[index].checkbox = (<Checkbox checked={porcentagensLucrosAux.current[index].isSelected} onClick={() => { addPorcentagemLucro(item, index); }} />); // Coloca uma checkbox
    setPorcentagensLucros([...porcentagensLucrosAux.current]);
    produtoContext.useValues.setValues({...produtoContext.useValues.values, valuesProfit:porcentagensLucrosAux.current});
    produtoContext.formik.setFieldValue('valuesProfit', [...porcentagensLucrosAux.current]);
  }

  const handleClickOpen = () => {
    setOpenShowOnTable(true);
  };

  const handleClose = () => {
    setOpenShowOnTable(false);
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
      },
    },
    {
      name: "checkbox",
      label: "Selecione",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  const options = {
    expandableRowsHeader: false,
    print: false,
    download: false,
    filter: false,
    selectableRows: "none",
    selectableRowsHeader: false,
    search: false,
    viewColumns: false,
    pagination: false,
    textLabels: {
      body: {
        noMatch: "Nenhum resultado encontrado.",
      },
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

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            style={{ marginBottom: 24 }}
            type="number"
            min="0"
            step="0.0001"
            label="Valor de Custo"
            fullWidth
            value={produtoContext.useValues.values.valorCusto}
            name="valorCusto"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorCusto && Boolean(produtoContext.formik.errors.valorCusto)}
            helperText={produtoContext.formik.touched.valorCusto && produtoContext.formik.errors.valorCusto}
          />
          <TextField
            variant="outlined"
            style={{ marginBottom: 24 }}
            type="number"
            min="0"
            step="0.0001"
            label="Despesas adicionais"
            fullWidth
            value={produtoContext.useValues.values.despesasAdicionais}
            name="despesasAdicionais"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.despesasAdicionais && Boolean(produtoContext.formik.errors.despesasAdicionais)}
            helperText={produtoContext.formik.touched.despesasAdicionais && produtoContext.formik.errors.despesasAdicionais}
          />
          <TextField
            variant="outlined"
            style={{ marginBottom: 24 }}
            type="number"
            min="0"
            step="0.0001"
            label="Outras despesas"
            fullWidth
            value={produtoContext.useValues.values.outrasDespesas}
            name="outrasDespesas"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.outrasDespesas && Boolean(produtoContext.formik.errors.outrasDespesas)}
            helperText={produtoContext.formik.touched.outrasDespesas && produtoContext.formik.errors.outrasDespesas}
          />
          <TextField
            variant="outlined"
            label="Custo final"
            type="number"
            fullWidth
            readOnly
            value={(
              parseFloat(produtoContext.useValues.values.valorCusto) +
              parseFloat(produtoContext.useValues.values.despesasAdicionais) +
              parseFloat(produtoContext.useValues.values.outrasDespesas)
            ).toFixed(4)}
            InputProps={{
              endAdornment: (
                <Tooltip title="O Custo Final é calculado automaticamente">
                  <HelpIcon />
                </Tooltip>
              ),
            }}
            name="custoFinal"
            onChange={handleOnChange}
            onBlur={produtoContext.formik.handleBlur}
            error={produtoContext.formik.touched.valorCusto && Boolean(produtoContext.formik.errors.valorCusto)}
            helperText={produtoContext.formik.touched.valorCusto && produtoContext.formik.errors.valorCusto}
          />
        </Grid>
        <br />
        <Grid
          container
          style={{ alignContent: "flex-start" }}
          xs={6}
        >
          <Grid item xs={12} style={{ marginLeft: 16 }}>
            <MUIDataTable
              title={"Porcentagem de Lucro"}
              data={porcentagensLucros}
              columns={columns}
              options={options}
              className={"table-background"}
            />
          </Grid>
          <Grid container xs={12} style={{ marginLeft: 16, marginTop: 8 }}>
            <Grid item style={{ display: "flex", gap: "15px" }}>
              <Button
                variant="contained"
                className="btn btn-primary"
                startIcon={<CalculateIcon />}
                onClick={handleClickOpen}
              >
                Cadastrar valor de lucro
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Pop-ups */}
        <Dialog open={openShowOnTable} onClose={handleClose}>
          <DialogTitle className={"popup"}>
            Cadastrar porcentagem de lucro
          </DialogTitle>

          <DialogContent className={"popup"}>
            <TextField
              autoFocus
              id="name"
              name="descricao"
              value={porcentagemLucro.descricao}
              label="Descrição"
              type="text"
              onChange={handleOnChangePorcentagemLucro}
              fullWidth
              variant="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextField
              id="name"
              name="porcentagem"
              value={porcentagemLucro.porcentagem}
              label="Porcentagem (%)"
              type="text"
              onChange={handleOnChangePorcentagemLucro}
              fullWidth
              variant="outlined"
            />
          </DialogContent>

          <DialogActions
            className={"popup"}
            style={{ justifyContent: "space-around" }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  name="favorito"
                  checked={porcentagemLucro.favorito ? true : false}
                  onChange={handleOnChangePorcentagemLucro}
                />
              }
              label="Adicionar como favorito"
            />
            <div style={{ gap: "7px", display: "flex" }}>
              <Button className={"btn btn-error"} onClick={handleClose}>
                {" "}
                Fechar
              </Button>
              <Button
                className={"btn btn-success"}
                onClick={handleAddChangePorcentagemLucro}
              >
                Cadastrar
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}

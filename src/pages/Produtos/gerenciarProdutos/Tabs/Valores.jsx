import { useState, useEffect } from "react";
import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField, Divider, Dialog, DialogTitle, DialogContent, Checkbox, DialogActions, Button, FormControlLabel } from "@material-ui/core";
import api from "../../../../services/api";
import MUIDataTable from "mui-datatables";
import CalculateIcon from "@mui/icons-material/Calculate";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { infoAlert, successAlert } from "../../../../utils/alert";
import StarIcon from '@mui/icons-material/Star';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

export function Valores() {
  const [cad, setCad] = useState({
    descricao: "",
    porcentagem: 0,
    favorito: false
  });
  const [open, setOpen] = useState(false);
  const [openFavs, setOpenFavs] = useState(false);
  const [porcLucros, setPorcLucros] = useState([]);
  const [dataRow, setDataRow] = useState([]);
  const produtoContext = useProdutoContext();

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.useprodutoContext.useValues.values.produtoContext.useValues.setValues({ ...produtoContext.useprodutoContext.useValues.values.values, [name]: value });
    produtoContext.formik.setFieldValue(name, value);
    console.log(produtoContext.formik.values);
  }

  useEffect(() => {
    api.get("/porcentagens-lucros").then((response) => {

      response.data['data'].map((item) => {
        if (item.favorito) {
          item.favorito = <StarIcon style={{ color: 'gold' }} />
        }
        else {
          item.favorito = <DoDisturbIcon style={{ color: 'indianred' }} />
        }
        item.porcentagem = item.porcentagem + '%';
      });

      setPorcLucros(response.data['data']);
    });
  }, [cad]);

  function handleOnChangeFavs(event) {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      console.log(checked);
      setCad({ ...cad, [name]: checked ? true : false });
    } else {
      setCad({ ...cad, [name]: value });
    }
  }

  const handleAddValuesFavs = () => {

    handleClose();

    api.post('/porcentagem-lucro', cad)
      .then((response) => {
        successAlert("Sucesso", "Porcentagem de Lucro Cadastrada");
        setCad({ descricao: "", porcentagem: 0, favorito: false }); // Reseta o formulário
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      });
  };

  const handleInsertInTable = () => {
    produtoContext.useValues.setValues({ ...produtoContext.useValues.values, valuesProfit: [...produtoContext.useValues.values.valuesProfit, dataRow] });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenFavs = () => {
    setOpenFavs(true);
  };

  const handleCloseFavs = () => {
    setOpenFavs(false);
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
      name: "favorito",
      label: "Favorito",
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
    setCellProps: (value) => {
      console.log(value);
      return {
        style: {
          border: "2px solid blue",
        },
      };
    },
  };

  const options_lucro = {
    expandableRowsHeader: false,
    print: false,
    download: false,
    filter: false,
    search: false,
    viewColumns: false,
    pagination: false,
    filterType: "checkbox",
    textLabels: {
      body: {
        noMatch: "Nenhum resultado encontrado.",
      },
      selectedRows: {
        text: "linha(s) selecionadas",
      },
    },
    onRowsSelect: (rowsSelected, allRows) => {
      allRows.forEach((row) => {
        setDataRow(porcLucros[row.dataIndex]);
      });
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
    setCellProps: (value) => {
      console.log(value);
      return {
        style: {
          border: "2px solid blue",
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
      <Grid container spacing={3}>
        <Grid item xs={6} spacing={6}>
          <TextField variant="outlined"
            style={{ marginBottom: 24 }}
            label="Valor de Custo"
            fullWidth
            value={produtoContext.useValues.values.valor_custo}
            name="valor_custo"
            onChange={handleOnChange}
          />
          <TextField variant="outlined"
            style={{ marginBottom: 24 }}
            label="Despesas adicionais"
            fullWidth
            value={produtoContext.useValues.values.despesa_acessoria}
            name="despesa_acessoria"
            onChange={handleOnChange}
          />
          <TextField variant="outlined"
            style={{ marginBottom: 24 }}
            label="Outras despesas"
            fullWidth
            value={produtoContext.useValues.values.outras_despesas}
            name="outras_despesas"
            onChange={handleOnChange}
          />
          <TextField
            variant="outlined"
            label="Custo final"
            fullWidth
            value={produtoContext.useValues.values.custoFinal}
            name="custoFinal"
            onChange={handleOnChange}
          />
        </Grid>
        <br />
        <Divider />
        <Grid spacing={1} container style={{ alignContent: "flex-start" }} item xs={6}>
          <Grid item xs={12}>
            <MUIDataTable
              title={"Porcentagem de Lucro"}
              data={produtoContext.useValues.values.valuesProfit}
              columns={columns} options={options}
              className={"table-background"} />
          </Grid>
          <Grid spacing={1} container item xs={12}>
            <Grid item style={{ display: "flex", gap: "15px" }}>
              <Button variant="contained"
                className="btn btn-primary"
                startIcon={<CalculateIcon />}
                onClick={handleClickOpen}>
                Cadastrar valor de lucro
              </Button>
              <Button variant="contained"
                className="btn btn-success"
                startIcon={<CalculateIcon />}
                onClick={handleClickOpenFavs}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Pop-ups */}
        <Dialog open={open} onClose={handleClose}>

          <DialogTitle className={"popup"}>Cadastrar porcentagem de lucro</DialogTitle>

          <DialogContent className={"popup"}>
            <TextField
              autoFocus
              id="name"
              name="descricao"
              value={cad.descricao}
              label="Descrição"
              type="text"
              onChange={handleOnChangeFavs}
              fullWidth
              variant="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextField
              id="name"
              name="porcentagem"
              value={cad.porcentagem}
              label="Porcentagem (%)"
              type="text"
              onChange={handleOnChangeFavs}
              fullWidth
              variant="outlined"
            />
          </DialogContent>

          <DialogActions
            className={"popup"}
            style={{ justifyContent: "space-around" }}>
            <FormControlLabel
              control={<Checkbox color="primary" name="favorito" checked={cad.favorito ? true : false} onChange={handleOnChangeFavs} />}
              label="Adicionar como favorito"
            />
            <div style={{ gap: "7px", display: "flex" }}>
              <Button className={"btn btn-error"} onClick={handleClose}> Fechar</Button>
              <Button className={"btn btn-success"} onClick={handleAddValuesFavs}>Cadastrar</Button>
            </div>
          </DialogActions>

        </Dialog>

        <Dialog open={openFavs} fullWidth={"lg"} onClose={handleCloseFavs}>

          <DialogTitle className={"popup"}>Selecionar porcentagens de lucros</DialogTitle>

          <DialogContent className={"popup"}>
            <MUIDataTable data={porcLucros} columns={columns} options={options_lucro} className={"table-background"} />
          </DialogContent>

          <DialogActions className={"popup"}>
            <Button className={"btn btn-error"} onClick={handleCloseFavs}>
              Fechar
            </Button>
            <Button className={"btn btn-success"} onClick={handleInsertInTable}>
              Inserir na tabela
            </Button>
          </DialogActions>

        </Dialog>
      </Grid>
    </>
  );
}

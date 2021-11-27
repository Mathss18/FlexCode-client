import { useContext, useState, useEffect } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField, Divider, Dialog, DialogTitle, DialogContent, Checkbox, DialogActions, Button, FormControlLabel } from "@material-ui/core";
import api from "../../../../services/api";
import MUIDataTable from "mui-datatables";
import CalculateIcon from "@mui/icons-material/Calculate";

export function Valores() {
  const { values, setValues } = useContext(GerenciarProdutosContext);
  const [cad, setCad] = useState({});
  const [open, setOpen] = useState(false);
  const [openFavs, setOpenFavs] = useState(false);
  const [porcLucros, setPorcLucros] = useState([]);
  const [dataRow, setDataRow] = useState([]);

  useEffect(() => {
    api.get("/porcentagens-lucros").then((response) => {
      setPorcLucros(response.data.data);
    });
  }, []);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleOnChangeFavs(event) {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      console.log(checked);
      setCad({ ...cad, [name]: checked ? 1 : 0 });
    } else {
      setCad({ ...cad, [name]: value });
    }
  }

  console.log(cad);

  const handleAddValuesFavs = () => {
    setValues({ ...values, values_profit: [...values.values_profit, cad] });
    // values.values_profit.push(cad);
  };

  const handleInsertInTable = () => {
    setValues({ ...values, values_profit: [...values.values_profit, dataRow] });
  };

  console.log(values)

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
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Valor de Custo" required fullWidth value={values.valor_custo} name="valor_custo" onChange={handleOnChange} />
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Despesas acessórias" fullWidth value={values.despesasAdicionais} name="despesasAdicionais" onChange={handleOnChange} />
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Outras despesas" fullWidth value={values.outras_despesas} name="outras_despesas" onChange={handleOnChange} />
        <TextField variant="outlined" label="Custo final" fullWidth value={values.custoFinal} name="custoFinal" onChange={handleOnChange} />
      </Grid>
      <br />
      <Divider />
      <Grid spacing={1} container style={{ alignContent: "flex-start" }} item xs={6}>
        <Grid item xs={12}>
          <MUIDataTable title={"Porcentagem de Lucro"} data={values.values_profit} columns={columns} options={options} className={"table-background"} />
        </Grid>
        <Grid spacing={1} container item xs={12}>
          <Grid item style={{ display: "flex", gap: "15px" }}>
            <Button variant="contained" className="btn btn-primary" startIcon={<CalculateIcon />} onClick={handleClickOpen}>
              Cadastrar valor de lucro
            </Button>
            <Button variant="contained" className="btn btn-success" startIcon={<CalculateIcon />} onClick={handleClickOpenFavs}>
              Adicionar
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Pop-ups */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className={"popup"}>Cadastrar valor de Lucro</DialogTitle>
        <DialogContent className={"popup"}>
          <TextField autoFocus id="name" name="descricao" value={cad.descricao} label="Descrição" type="text" onChange={handleOnChangeFavs} fullWidth variant="outlined" style={{ marginBottom: 12 }} />
          <TextField id="name" name="porcentagem" value={cad.porcentagem} label="Porcentagem (%)" type="text" onChange={handleOnChangeFavs} fullWidth variant="outlined" />
        </DialogContent>
        <DialogActions className={"popup"} style={{ justifyContent: "space-around" }}>
          <FormControlLabel control={<Checkbox color="primary" name="favorito" onChange={handleOnChangeFavs} />} label="Adicionar como favorito" />
          <div style={{ gap: "7px", display: "flex" }}>
            <Button className={"btn btn-error"} onClick={handleClose}>
              Fechar
            </Button>
            <Button className={"btn btn-success"} onClick={handleAddValuesFavs}>
              Cadastrar
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <Dialog open={openFavs} fullWidth={"lg"} onClose={handleCloseFavs}>
        <MUIDataTable data={porcLucros} columns={columns} options={options_lucro} className={"table-background"} />
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
  );
}

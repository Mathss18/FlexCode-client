import { useContext, useState } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import CalculateIcon from "@mui/icons-material/Calculate";

export function Valores() {
  const { values, setValues } = useContext(GerenciarProdutosContext);
  const [open, setOpen] = useState(false);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      name: "valor",
      label: "Valor",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const data = [
    {
      descricao: "Descrição 1",
      valor: "R$ 1.000,00",
    },
    {
      descricao: "Descrição 2",
      valor: "R$ 2.000,00",
    },
    {
      descricao: "Descrição 3",
      valor: "R$ 3.000,00",
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
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Despesas acessórias" fullWidth value={values.despesa_acessoria} name="despesa_acessoria" onChange={handleOnChange} />
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Outras despesas" fullWidth value={values.outras_despesas} name="outras_despesas" onChange={handleOnChange} />
        <TextField variant="outlined" label="Custo final" fullWidth value={values.custo_final} name="custo_final" onChange={handleOnChange} />
      </Grid>
      <br />
      <Divider />
      <Grid spacing={1} container item xs={6}>
        <Grid item xs={12}>
          <MUIDataTable title={"Valores de custo"} data={data} columns={columns} options={options} className={"table-background"} />
        </Grid>
        <Grid spacing={1} container item xs={12}>
          <Grid item>
            <Button variant="contained" className="btn btn-primary" startIcon={<CalculateIcon />} onClick={handleClickOpen}>
              Cadastrar valor de venda
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className={"popup"}>Subscribe</DialogTitle>
        <DialogContent className={"popup"}>
          <TextField autoFocus id="name" label="Email Address" type="email" fullWidth variant="outlined" style={{ marginBottom: 12}} />
          <TextField  id="name" label="Email Address" type="email" fullWidth variant="outlined" />
        </DialogContent>
        <DialogActions className={"popup"}>
          <Button className={"btn btn-danger"} onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

import { useContext, useState } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField, Divider, Dialog, DialogTitle, DialogContent, Checkbox, DialogActions, Button, FormControlLabel } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import CalculateIcon from "@mui/icons-material/Calculate";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export function Valores() {
  const { values, setValues } = useContext(GerenciarProdutosContext);
  const [cad, setCad] = useState({
    descricao: "",
    porcentagem: "",
    favorite: 0
  });
  const [open, setOpen] = useState(false);
  const [openFavs, setOpenFavs] = useState(false);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleOnChangeFavs(event) {
    const { name, value, type, checked } = event.target;
    if(type === "checkbox"){
      console.log(checked);
      setCad({ ...cad, [name]: checked ? 1 : 0 });
    }else{
      setCad({ ...cad, [name]: value });
    }
  }

  console.log(cad)

  const handleAddValuesFavs = () => {
    setValues({ ...values, values_profit: [...values.values_profit, cad] });
    // values.values_profit.push(cad);
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
  ];

  const data = [
    {
      descricao: "Descrição 1",
      porcentagem: "R$ 1.000,00",
    },
    {
      descricao: "Descrição 2",
      porcentagem: "R$ 2.000,00",
    },
    {
      descricao: "Descrição 3",
      porcentagem: "R$ 3.000,00",
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

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Valor de Custo" required fullWidth value={values.valor_custo} name="valor_custo" onChange={handleOnChange} />
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Despesas adicionais" fullWidth value={values.despesa_acessoria} name="despesa_acessoria" onChange={handleOnChange} />
        <TextField variant="outlined" style={{ marginBottom: 24 }} label="Outras despesas" fullWidth value={values.outras_despesas} name="outras_despesas" onChange={handleOnChange} />
        <TextField variant="outlined" label="Custo final" fullWidth value={values.custo_final} name="custo_final" onChange={handleOnChange} />
      </Grid>
      <br />
      <Divider />
      <Grid spacing={1} container style={{ alignContent: "flex-start" }} item xs={6}>
        <Grid item xs={12}>
          <MUIDataTable title={"Valores de custo"} data={values.values_profit} columns={columns} options={options} className={"table-background"} />
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className={"popup"}>Cadastrar valor de Lucro</DialogTitle>
        <DialogContent className={"popup"}>
          <TextField autoFocus id="name" name="descricao" value={cad.descricao} label="Descrição" type="text" onChange={handleOnChangeFavs} fullWidth variant="outlined" style={{ marginBottom: 12 }} />
          <TextField id="name" name="porcentagem" value={cad.porcentagem} label="Porcentagem (%)" type="text" onChange={handleOnChangeFavs} fullWidth variant="outlined" />
        </DialogContent>
        <DialogActions className={"popup"} style={{ justifyContent: "space-around" }}>
          <FormControlLabel control={<Checkbox color="primary" name="favorite" onChange={handleOnChangeFavs} />} label="Adicionar como favorito" />
          <div style={{gap: '7px', display: 'flex'}}>
            <Button className={"btn btn-error"} onClick={handleClose}>
              Fechar
            </Button>
            <Button className={"btn btn-success"} onClick={handleAddValuesFavs}>
              Cadastrar
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <Dialog open={openFavs} onClose={handleCloseFavs}>
        <DialogTitle className={"popup"}>Subscribe</DialogTitle>
        <DialogContent className={"popup"}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions className={"popup"}>
          <Button className={"btn btn-danger"} onClick={handleCloseFavs}>
            Cancel
          </Button>
          <Button onClick={handleCloseFavs}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

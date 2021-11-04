import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

export function Dados() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <TextField required variant="outlined" label="Nome do produto" fullWidth value={values.name} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField required variant="outlined" label="Código interno" fullWidth value={values.codigo_interno} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Código de barra" fullWidth value={values.codigo_barras} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <TextField variant="outlined" label="Grupo do produto" fullWidth value={values.grupo_do_produto} name="name" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth name="movimenta_estoque">
          <InputLabel>Movimenta Estoque?</InputLabel>
          <Select className={"input-select"} label="Movimenta Estoque?" name="movimenta_estoque" value={values.movimenta_estoque} onChange={handleOnChange}>
            <MenuItem value={0}>Não</MenuItem>
            <MenuItem value={1}>Sim</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth name="habilitar_nota_fiscal">
          <InputLabel>Habilitar Nota Fiscal?</InputLabel>
          <Select className={"input-select"} label="Habilitar Nota Fiscal?" name="habilitar_nota_fiscal" value={values.habilitar_nota_fiscal} onChange={handleOnChange}>
            <MenuItem value={0}>Não</MenuItem>
            <MenuItem value={1}>Sim</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth name="possui_variacoes">
          <InputLabel>Possui Variações?</InputLabel>
          <Select className={"input-select"} label="Possui Variações?" name="possui_variacoes" value={values.possui_variacoes} onChange={handleOnChange}>
            <MenuItem value={0}>Não</MenuItem>
            <MenuItem value={1}>Sim</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth name="possui_composicao">
          <InputLabel>Possui composição?</InputLabel>
          <Select className={"input-select"} label="Possui composição?" name="possui_composicao" value={values.possui_composicao} onChange={handleOnChange}>
            <MenuItem value={0}>Não</MenuItem>
            <MenuItem value={1}>Sim</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

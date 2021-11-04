import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField } from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";

export function Detalhes() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <Grid container spacing={3}>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Dimensões</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField variant="outlined" style={{ marginBottom: 24 }} label="Peso (kg)" fullWidth value={values.peso} name="peso" onChange={handleOnChange} />
          <TextField variant="outlined" style={{ marginBottom: 24 }} label="Largura (m)" fullWidth value={values.largura} name="largura" onChange={handleOnChange} />
          <TextField variant="outlined" style={{ marginBottom: 24 }} label="Altura (m)" fullWidth value={values.altura} name="altura" onChange={handleOnChange} />
          <TextField variant="outlined" label="Comprimento (m)" fullWidth value={values.comprimento} name="comprimento" onChange={handleOnChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField variant="outlined" style={{ marginBottom: 24 }} label="Comissão (%)" fullWidth value={values.comicao} name="comicao" onChange={handleOnChange} />
          <TextField multiline className={"input-select"} variant="outlined" label="Descrição do Produto" fullWidth value={values.descricao} rows={5} name="descricao" onChange={handleOnChange} />
        </Grid>
      </Grid>
    </Grid>
  );
}

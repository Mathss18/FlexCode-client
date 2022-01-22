import { useContext } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField } from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";

export function Fornecedores() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container spacing={3}>
        <TextField variant="outlined" label="Fornecedor" fullWidth value={values.fornecedor} name="fornecedor" onChange={handleOnChange} />
      </Grid>
    </>
  );
}

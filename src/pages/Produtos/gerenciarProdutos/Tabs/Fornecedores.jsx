import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import { Button, Grid, TextField } from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import api from "../../../../services/api";

export function Fornecedores() {
  const produtoContext = useProdutoContext();

  function handleCadastrarProduto() {
    console.log(produtoContext.formik.values);

    api.post("/produto", produtoContext.formik.values)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }


  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Button className="btn btn-primary" onClick={handleCadastrarProduto}>Cadastrar Produto</Button>
        </Grid>
      </Grid>
    </>
  );
}

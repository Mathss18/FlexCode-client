import { useContext, useState } from "react";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, CardMedia, Button } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

export function Fotos() {
  const { values, setValues } = useContext(GerenciarProdutosContext);

  function handleCapture(event) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(...event.target.files);
    fileReader.onload = (e) => {
      if (fileReader.readyState === 2) {
        console.log(e.target.result)
        setValues({ ...values, foto: e.target.result });
      }
    };

  }

  return (
    <Grid container spacing={3}>
      <Grid container>
        <Button variant="contained" component="label" startIcon={<PhotoCamera />} className={"btn btn-primary btn-spacing"}>
          Carregar Imagem
          <input name="foto" hidden multiple accept="image/*" type="file" onChange={handleCapture} />
        </Button>
      </Grid>
      <Grid item xs={2}>
        <CardMedia component="img" alt="Imagem Funcionario" image={values.foto} title="Imagem Funcionario" />
      </Grid>
    </Grid>
  );
}

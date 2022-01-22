import { useContext, useState, useCallback } from "react";
// import { useDropzone } from "react-dropzone";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, CardMedia, Button } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import OpenWithIcon from "@mui/icons-material/OpenWith";

export function Fotos() {
  const { values, setValues } = useContext(GerenciarProdutosContext);


  // function handleCapture(event) {
  //   const fileReader = new FileReader();
  //   fileReader.readAsDataURL(...event.target.files);
  //   fileReader.onload = (e) => {
  //     if (fileReader.readyState === 2) {
  //       console.log(e.target.result);
  //       setValues({ ...values, foto: e.target.result });
  //     }
  //   };
  // }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Fotos</h3>
      </div>
      <Grid container spacing={3}>
        <Grid container>
        </Grid>
        <Grid item xs={2}>
          <CardMedia component="img" alt="Imagem Funcionario" image={values.foto} title="Imagem Funcionario" />
        </Grid>
      </Grid>
    </>
  );
}

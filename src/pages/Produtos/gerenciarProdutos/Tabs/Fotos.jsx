import { useContext, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, CardMedia, Button } from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

export function Fotos() {
  const { values, setValues } = useContext(GerenciarProdutosContext);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        reader.readAsDataURL(file);
        if (reader.readyState === 2) {
          console.log(reader.result);
          setValues({ ...values, foto: reader.result });
        }
        console.log(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    <Grid container spacing={3}>
      <Grid item {...getRootProps()} style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out'
      }}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Solte as imagens aqui ...</p> : <p>Solte as imagens aqui, ou clique aqui para selecionar as imagens</p>}
      </Grid>
      <Grid container>
        {/* <Button variant="contained" component="label" startIcon={<PhotoCamera />} className={"btn btn-primary btn-spacing"}>
          Carregar Imagem
          <input name="foto" hidden multiple accept="image/*" type="file" onChange={handleCapture} />
        </Button> */}
      </Grid>
      <Grid item xs={2}>
        <CardMedia component="img" alt="Imagem Funcionario" image={values.foto} title="Imagem Funcionario" />
      </Grid>
    </Grid>
  );
}

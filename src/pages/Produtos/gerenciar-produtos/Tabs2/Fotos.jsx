import { Grid } from "@material-ui/core";
import { useEffect, useState} from "react";
import DragAndDrop from "../../../../components/dragdrop/DragAndDrop";
import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import { moveObjectInArray } from "../../../../utils/functions";




export function Fotos() {
  const produtoContext = useProdutoContext();
  const [files, setFiles] = useState(produtoContext.formik.values.foto_produto);

  // Usado para colocar a imagem principal na posição 0 do array de imagens
  useEffect(() => {
    files.forEach((item,index) => {
      if(item.foto == produtoContext.formik.values.fotoPrincipal){
        setFiles(moveObjectInArray(files, index, 0));
      }
    });
  }, []);

  useEffect(() => {
    produtoContext.formik.setFieldValue('foto_produto', files); // Altera o formik
  
  }, [files]);

  
  useEffect(() => {
    produtoContext.formik.setFieldValue('fotoPrincipal', files[0]); // Altera o formik
    
    return () => {
      produtoContext.formik.setFieldValue('fotoPrincipal', files[0]); // Altera o formik
    }

  },[files])


  return (
    <>
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <OpenWithIcon />
      <h3>Detalhes</h3>
    </div>
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <DragAndDrop state={[files, setFiles]} fileType="imagem" listImages></DragAndDrop>
      </Grid>
    </Grid>
  </>
  );
}

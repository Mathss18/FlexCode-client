import { useContext, useEffect, useState } from "react";
import api from "../../../../services/api";
import { GerenciarProdutosContext } from "../../../../context/GerenciarProdutosContext";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

export function Dados() {
  const { values, setValues } = useContext(GerenciarProdutosContext);
  const [ grupoProdutos, setGrupoProdutos ] = useState([]);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  useEffect(() => {

    api.get("/grupos-produtos").then(res => {
      setGrupoProdutos(res.data.data);
    }).catch(err => {
      console.log('Erro:' + err);
    });

  }, [grupoProdutos])

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <TextField required variant="outlined" label="Nome do produto" fullWidth value={values.nome} name="nome" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={4}>
        <TextField required variant="outlined" label="Código interno" fullWidth value={values.codigoInterno} name="codigoInterno" onChange={handleOnChange} />
      </Grid>
      <Grid item xs={4}>
        <FormControl variant="outlined" fullWidth name="grupo_produto_id">
          <InputLabel>Grupo de Produtos</InputLabel>
          <Select className={"input-select"} label="Grupo de Produtos" name="grupo_produto_id" value={values.grupo_produto_id} onChange={handleOnChange}>
            <MenuItem value={0}>Nenhum</MenuItem>
            {grupoProdutos &&
              grupoProdutos.map((grupo) => {
                return <MenuItem value={grupo.id}>{grupo.nome}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl variant="outlined" fullWidth name="movimentaEstoque">
          <InputLabel>Movimenta Estoque?</InputLabel>
          <Select className={"input-select"} label="Movimenta Estoque?" name="movimentaEstoque" value={values.movimentaEstoque} onChange={handleOnChange}>
            <MenuItem value={false}>Não</MenuItem>
            <MenuItem value={true}>Sim</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl variant="outlined" fullWidth name="habilitaNotaFiscal">
          <InputLabel>Habilitar Nota Fiscal?</InputLabel>
          <Select className={"input-select"} label="Habilitar Nota Fiscal?" name="habilitaNotaFiscal" value={values.habilitaNotaFiscal} onChange={handleOnChange}>
            <MenuItem value={false}>Não</MenuItem>
            <MenuItem value={true}>Sim</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl variant="outlined" fullWidth name="possuiVariacoes">
          <InputLabel>Possui Variações?</InputLabel>
          <Select className={"input-select"} label="Possui Variações?" name="possuiVariacoes" value={values.possuiVariacoes} onChange={handleOnChange}>
            <MenuItem value={false}>Não</MenuItem>
            <MenuItem value={true}>Sim</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

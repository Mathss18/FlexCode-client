import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import CardRelatorio from "../../components/relatorios/CardRelatorio";

function ListarRelatorios() {
  const history = useHistory();
  return (
    <Grid container spacing={2}>
      <Grid item>
        <CardRelatorio title="Rendimentos vs Despesas" click={()=>{history.push('/relatorios/rendimentosVsDespesas')}} />
      </Grid>
      <Grid item>
        <CardRelatorio title="Patrimônio ao longo do tempo" click={()=>{history.push('/relatorios/patrimonioAoLongoDoTempo')}}/>
      </Grid>
      <Grid item>
        <CardRelatorio title="Vendas por período" click={()=>{history.push('/relatorios/vendas')}}/>
      </Grid>
    </Grid>
  );
}

export default ListarRelatorios;

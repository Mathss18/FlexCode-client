import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import * as locales from "react-date-range/dist/locale";
import { DateRangePicker } from "react-date-range";
import {
  defaultInputRanges,
  defaultStaticRanges,
} from "../../config/dateRangeConfig";
import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import moment from "moment";
import api from "../../services/api";
import toast from "react-hot-toast";

function ReajusteDePrecos() {
  const fullScreenLoader = useFullScreenLoader();
  const [favorecidos, setFavorecidos] = useState([]);
  const [selectedFavorecido, setSelectedFavorecido] = useState(null);
  const [porcentagem, setPorcentagem] = useState(0);

  const handleSave = () => {
    if (!selectedFavorecido) {
      toast.error("Por favor, selecione um cliente antes de salvar.");
      return;
    }

    if (porcentagem === 0) {
      toast.error("Por favor, insira uma porcentagem válida.");
      return;
    }

    fullScreenLoader.setLoading(true);
    api
      .post(`/relatorios/reajuste-de-precos`, {
        client_id: selectedFavorecido?.value,
        porcentagem: porcentagem,
      })
      .then(() => {
        toast.success("Preço reajustado com sucesso");
        setSelectedFavorecido(null);
        setPorcentagem(0);
      })
      .catch(() => {
        toast.error("Erro ao salvar o reajuste de preços.");
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  };

  useEffect(() => {
    const reqClientes = api.get("/clientes");

    Promise.all([reqClientes])
      .then((response) => {
        const array = response[0].data["data"].map((cliente) => ({
          label: cliente.nome,
          value: cliente.id,
          type: "clientes",
        }));

        setFavorecidos(array);
      })
      .catch(() => {
        toast.error("Erro ao carregar os favorecidos");
      });
  }, []);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <h2>Selecione um cliente</h2>
          <Autocomplete
            value={selectedFavorecido}
            onChange={(event, value) => setSelectedFavorecido(value)}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            options={favorecidos}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Cliente"
                placeholder="Pesquise..."
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <h2>Porcentagem</h2>
          <TextField
            variant="outlined"
            label="Porcentagem *"
            fullWidth
            type="number"
            value={porcentagem}
            onChange={(e) => setPorcentagem(Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
          >
            Salvar Reajuste
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ReajusteDePrecos;

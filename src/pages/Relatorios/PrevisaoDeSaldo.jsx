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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Button } from "@mui/material";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import moment from "moment";
import api from "../../services/api";
import GraficoPrevisaoDeSaldo from "../../components/relatorios/GraficoPrevisaoDeSaldo";

function PrevisaoDeSaldo() {
  const date = new Date();
  const fullScreenLoader = useFullScreenLoader();
  const [dados, setDados] = useState(null);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      endDate: new Date(new Date().getFullYear(), date.getMonth() + 1, date.getDate()),
      key: "selection",
    },
  ]);
  function handleClose() {
    setOpen(false);
  }

  useEffect(() => {
    if (open) return;

    fullScreenLoader.setLoading(true);
    api
      .get(
        `/relatorios/previsao-de-saldo?startDate=${moment(
          state[0].startDate
        ).format("YYYY-MM-DD")}&endDate=${moment(state[0].endDate).format(
          "YYYY-MM-DD"
        )}`
      )
      .then((response) => {
        setDados(response.data["data"]);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, [open]);

  return (
    <>
      <Dialog
        fullWidth={false}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Selecione um intervalo personalizado</DialogTitle>
        <DialogContent>
          <DateRangePicker
            onChange={(item) => setState([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            minDate={
              new Date(date.getFullYear(), date.getMonth(), date.getDate())
            }
            ranges={state}
            direction="horizontal"
            locale={locales.pt}
            dateDisplayFormat={"dd/MM/yyyy"}
            staticRanges={defaultStaticRanges}
            inputRanges={defaultInputRanges}
            showMonthAndYearPickers={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        startIcon={<CalendarMonthIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        {`${new Date(state[0].startDate).toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })} - ${new Date(state[0].endDate).toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}`}
      </Button>

      <GraficoPrevisaoDeSaldo dados={dados} />
    </>
  );
}

export default PrevisaoDeSaldo;

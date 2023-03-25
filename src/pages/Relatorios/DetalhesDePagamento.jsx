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
import { addDays } from "date-fns";
import { useHistory } from "react-router-dom";
import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import moment from "moment";
import api from "../../services/api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import toast from "react-hot-toast";

function DetalhesDePagamento() {
  const fullScreenLoader = useFullScreenLoader();
  const [open, setOpen] = useState(false);
  const [dataAbertos, setDataAbertos] = useState(() => () => {});
  const [dataRegistrados, setDataRegistrados] = useState(() => () => {});
  const [rendimentosAbertosTotal, setRendimentosAbertosTotal] = useState(0);
  const [rendimentosRegistradosTotal, setRendimentosRegistradosTotal] =
    useState(0);
  const [favorecidos, setFavorecidos] = useState([]);
  const [selectedFavorecido, setSelectedFavorecido] = useState(null);

  const date = new Date();
  const firstDayOfCurrentMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
  const lastDayOfCurrentMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );
  const [state, setState] = useState([
    {
      startDate: firstDayOfCurrentMonth,
      endDate: lastDayOfCurrentMonth,
      key: "selection",
    },
  ]);

  function handleClose() {
    setOpen(false);
  }

  useEffect(() => {
    if (open || !selectedFavorecido) return;

    fullScreenLoader.setLoading(true);
    api
      .post(
        `/relatorios/detalhes-de-pagamento?startDate=${moment(
          state[0].startDate
        ).format("YYYY-MM-DD")}&endDate=${moment(state[0].endDate).format(
          "YYYY-MM-DD"
        )}`,
        {
          idFavorecido: selectedFavorecido?.value,
          tipoFavorecido: selectedFavorecido?.type,
        }
      )
      .then((response) => {
        const {
          rendimentosAbertos,
          rendimentosAbertosTotal,
          rendimentosRegistrados,
          rendimentosRegistradosTotal,
        } = response.data["data"];

        setDataAbertos(() => () => {
          return rendimentosAbertos.map((row, index) => {
            return createRows(row, index);
          });
        });
        setDataRegistrados(() => () => {
          return rendimentosRegistrados.map((row, index) => {
            return createRows(row, index);
          });
        });
        setRendimentosAbertosTotal(rendimentosAbertosTotal[0].valor ?? 0);
        setRendimentosRegistradosTotal(
          rendimentosRegistradosTotal[0].valor ?? 0
        );
        console.log(response.data["data"]);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, [open, selectedFavorecido]);

  useEffect(() => {
    const reqClientes = api.get("/clientes");
    const reqFornecedores = api.get("/fornecedores");
    const reqFuncionatios = api.get("/funcionarios");
    const reqOutrosFavorecidos = api.get("/outros-favorecidos");
    Promise.all([
      reqClientes,
      reqFornecedores,
      reqFuncionatios,
      reqOutrosFavorecidos,
    ])
      .then((response) => {
        var array = [];
        response[0].data["data"].forEach((cliente) => {
          array.push({
            label: `[CLIENTE] ${cliente.nome}`,
            value: cliente.id,
            type: "clientes",
          });
        });
        response[1].data["data"].forEach((fornecedor) => {
          array.push({
            label: `[FORNECEDOR] ${fornecedor.nome}`,
            value: fornecedor.id,
            type: "fornecedores",
          });
        });
        response[2].data["data"].forEach((funcionario) => {
          array.push({
            label: `[FUNCIONÁRIO] ${funcionario.nome}`,
            value: funcionario.id,
            type: "funcionarios",
          });
        });
        response[3].data["data"].forEach((outroFavorecido) => {
          array.push({
            label: `[OUTROS] ${outroFavorecido.nome}`,
            value: outroFavorecido.id,
            type: "outros_favorecidos",
          });
        });

        setFavorecidos(array);
      })
      .catch((error) => {
        toast.error("Erro ao carregar os favorecidos");
      });
  }, []);

  function createRows(row, index) {
    return (
      <TableRow
        key={row.categoria}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        className={index % 2 === 0 ? "row row-par" : "row row-impar"}
      >
        <TableCell component="th" scope="row">
          {new Date(row.data).toLocaleString("pt-br", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "UTC",
          })}
        </TableCell>
        <TableCell>{row.conta_bancaria_nome}</TableCell>
        <TableCell>{row.tipoFavorecido}</TableCell>
        <TableCell>{row.favorecido_nome}</TableCell>
        <TableCell align="right">
          {row.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </TableCell>
      </TableRow>
    );
  }

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

      <Grid container>
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
            timeZone: "UTC",
          })} - ${new Date(state[0].endDate).toLocaleString("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "UTC",
          })}`}
        </Button>
        <Grid item xs={4}>
          <Autocomplete
            value={selectedFavorecido}
            name="favorecido_id"
            onChange={(event, value) => {
              setSelectedFavorecido(value);
              console.log(value);
            }}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={favorecidos}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Cliente/Fornecedor/Funcionário"
                placeholder="Pesquise..."
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <h2>Valores em aberto</h2>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Conta Bancária</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Favorecido</TableCell>
                  <TableCell align="right">Valor Total&nbsp;(R$)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{dataAbertos()}</TableBody>
            </Table>
          </TableContainer>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className={"row-par"}
            >
              <TableCell component="th" scope="row">
                <b>TOTAL FINAL:</b>
              </TableCell>
              <TableCell align="right">
                <b style={{ color: "#539e61" }}>
                  {rendimentosAbertosTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </b>
              </TableCell>
            </TableRow>
          </Grid>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <h2>Valores fechados</h2>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Conta Bancária</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Favorecido</TableCell>
                  <TableCell align="right">Valor Total&nbsp;(R$)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{dataRegistrados()}</TableBody>
            </Table>
          </TableContainer>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className={"row-par"}
            >
              <TableCell component="th" scope="row">
                <b>TOTAL FINAL:</b>
              </TableCell>
              <TableCell align="right">
                <b style={{ color: "#539e61" }}>
                  {rendimentosRegistradosTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </b>
              </TableCell>
            </TableRow>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default DetalhesDePagamento;

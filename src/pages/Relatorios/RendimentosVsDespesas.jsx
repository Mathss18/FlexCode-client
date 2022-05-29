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
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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

function RendimentosVsDespesas() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const [open, setOpen] = useState(false);
  const [situacao, setSituacao] = useState("Ambas");
  const [values, setValues] = useState(null);
  const [data, setData] = useState(() => () => {});
  const [rowsRendimentos, setRowRendimentos] = useState([]);
  const [rowsDespesas, setRowDespesas] = useState([]);

  const date = new Date()
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
    if (open) return;

    fullScreenLoader.setLoading(true);
    api
      .get(
        `/relatorios/rendimentos-vs-despesas?startDate=${moment(
          state[0].startDate
        ).format("YYYY-MM-DD")}&endDate=${moment(state[0].endDate).format(
          "YYYY-MM-DD"
        )}`
      )
      .then((response) => {
        setValues(response.data["data"]);
        if (situacao === "Ambas") {
          setRowRendimentos(response.data["data"].rendimentosCategoria);
          setRowDespesas(response.data["data"].despesasCategoria);
        } else if (situacao === "Abertas") {
          setRowRendimentos(response.data["data"].rendimentosAbertosCategoria);
          setRowDespesas(response.data["data"].despesasAbertasCategoria);
        } else if (situacao === "Registradas") {
          setRowRendimentos(
            response.data["data"].rendimentosRegistradosCategoria
          );
          setRowDespesas(response.data["data"].despesasRegistradasCategoria);
        }
      })
      .finally(() => {
        setData(() => () => {});
        fullScreenLoader.setLoading(false);
      });
  }, [open, situacao]);

  function showInformacoes(tipo, tipoFavorecido) {
    if (tipo === "rendimento") {
      if (situacao === "Ambas") {
        setData(() => () => {
          return values.rendimentos.map((row, index) => {
            if (row.tipoFavorecido !== tipoFavorecido) return;
            return createRows(row, index);
          });
        });
      } else if (situacao === "Abertas") {
        setData(() => () => {
          return values.rendimentosAbertos.map((row, index) => {
            if (row.tipoFavorecido !== tipoFavorecido) return;
            return createRows(row, index);
          });
        });
      } else if (situacao === "Registradas") {
        setData(() => () => {
          return values.rendimentosRegistrados.map((row, index) => {
            if (row.tipoFavorecido !== tipoFavorecido) return;
            return createRows(row, index);
          });
        });
      }
    } else {
      if (situacao === "Ambas") {
        setData(() => () => {
          return values.despesas.map((row, index) => {
            if (row.tipoFavorecido !== tipoFavorecido) return;
            return createRows(row, index);
          });
        });
      } else if (situacao === "Abertas") {
        setData(() => () => {
          return values.despesasAbertas.map((row, index) => {
            if (row.tipoFavorecido !== tipoFavorecido) return;
            return createRows(row, index);
          });
        });
      } else if (situacao === "Registradas") {
        setData(() => () => {
          return values.despesasRegistradas.map((row, index) => {
            if (row.tipoFavorecido !== tipoFavorecido) return;
            return createRows(row, index);
          });
        });
      }
    }
  }

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
          })}
        </TableCell>
        <TableCell>{row.conta_bancaria_nome}</TableCell>
        <TableCell>{row.tipoFavorecido}</TableCell>
        <TableCell>{row.favorecido_nome}</TableCell>
        <TableCell align="right">{row.valor.toFixed(2)}</TableCell>
      </TableRow>
    );
  }

  function getTotalFinalColor() {
    if (situacao === "Ambas") {
      var total =
        values?.rendimentosTotal[0]?.valor - values?.despesasTotal[0]?.valor;
      return total >= 0 ? "#007f45" : "#c62b2b";
    } else if (situacao === "Abertas") {
      var total =
        values?.rendimentosAbertosTotal[0]?.valor -
        values?.despesasAbertasTotal[0]?.valor;
      return total >= 0 ? "#007f45" : "#c62b2b";
    } else if (situacao === "Registradas") {
      var total =
        values?.rendimentosRegistradosTotal[0]?.valor -
        values?.despesasRegistradasTotal[0]?.valor;
      return total >= 0 ? "#007f45" : "#c62b2b";
    }
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
          })} - ${new Date(state[0].endDate).toLocaleString("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}`}
        </Button>
        <FormControl sx={{ m: 1, width: 200 }} size="small">
          <InputLabel>Situação das transações</InputLabel>
          <Select
            dense
            className={"input-select"}
            label="Situação das transações"
            name="tipoCliente"
            value={situacao}
            onChange={(e) => {
              setSituacao(e.target.value);
            }}
          >
            <MenuItem value={"Abertas"}>Abertas</MenuItem>
            <MenuItem value={"Registradas"}>Registradas</MenuItem>
            <MenuItem value={"Ambas"}>Ambas</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <h2>Categoria de rendimentos</h2>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Categoria de rendimento</TableCell>
                  <TableCell align="right">Valor Total&nbsp;(R$)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsRendimentos.map((row, index) => (
                  <TableRow
                    onClick={() => {
                      showInformacoes("rendimento", row.categoria);
                    }}
                    key={row.categoria}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className={
                      index % 2 === 0 ? "row row-par" : "row row-impar"
                    }
                  >
                    <TableCell component="th" scope="row">
                      {row.categoria}
                    </TableCell>
                    <TableCell align="right">{row.valor.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className={"row-par"}
                >
                  <TableCell component="th" scope="row">
                    <b>TOTAL RENDIMENTOS:</b>
                  </TableCell>
                  <TableCell align="right">
                    <b style={{ color: "#007f45" }}>
                      {situacao === "Ambas"
                        ? values?.rendimentosTotal[0]?.valor?.toFixed(2)
                        : situacao === "Abertas"
                        ? values?.rendimentosAbertosTotal[0]?.valor?.toFixed(2)
                        : values?.rendimentosRegistradosTotal[0]?.valor?.toFixed(
                            2
                          )}
                    </b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <h2>Categoria de despesas</h2>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Categoria de despesas</TableCell>
                  <TableCell align="right">Valor Total&nbsp;(R$)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsDespesas.map((row, index) => (
                  <TableRow
                    onClick={() => {
                      showInformacoes("despesa", row.categoria);
                    }}
                    key={row.categoria}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className={
                      index % 2 === 0 ? "row row-par" : "row row-impar"
                    }
                  >
                    <TableCell component="th" scope="row">
                      {row.categoria}
                    </TableCell>
                    <TableCell align="right">{row.valor.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className={"row-par"}
                >
                  <TableCell component="th" scope="row">
                    <b>VALOR DESPESAS:</b>
                  </TableCell>
                  <TableCell align="right">
                    <b style={{ color: "#c62b2b" }}>
                      {situacao === "Ambas"
                        ? values?.despesasTotal[0]?.valor?.toFixed(2)
                        : situacao === "Abertas"
                        ? values?.despesasAbertasTotal[0]?.valor?.toFixed(2)
                        : values?.despesasRegistradasTotal[0]?.valor?.toFixed(
                            2
                          )}
                    </b>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid conteiner style={{ marginTop: 12 }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <TableRow
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            className={"row-par"}
          >
            <TableCell component="th" scope="row">
              <b>TOTAL FINAL:</b>
            </TableCell>
            <TableCell align="right">
              <b style={{ color: getTotalFinalColor() }}>
                {situacao === "Ambas"
                  ? (
                      values?.rendimentosTotal[0]?.valor -
                      values?.despesasTotal[0]?.valor
                    )?.toFixed(2)
                  : situacao === "Abertas"
                  ? (
                      values?.rendimentosAbertosTotal[0]?.valor -
                      values?.despesasAbertasTotal[0]?.valor
                    )?.toFixed(2)
                  : (
                      values?.rendimentosRegistradosTotal[0]?.valor -
                      values?.despesasRegistradasTotal[0]?.valor
                    )?.toFixed(2)}
              </b>
            </TableCell>
          </TableRow>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <h2>Informações</h2>
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
              <TableBody>{data()}</TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}

export default RendimentosVsDespesas;

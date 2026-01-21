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
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import { useTheme } from "../../theme/useTheme";
import moment from "moment";
import api from "../../services/api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SpeedIcon from "@mui/icons-material/Speed";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TimerIcon from "@mui/icons-material/Timer";

function AnaliseOperacional() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    leadTime: {
      medio: 0,
      minimo: 0,
      maximo: 0,
      totalConcluidas: 0,
      faixas: [],
      topLeadTime: [],
    },
    taxaCancelamento: {
      vendas: {
        total: 0,
        canceladas: 0,
        concluidas: 0,
        taxa: 0,
        valorCancelado: 0,
        valorConcluido: 0,
        porCliente: [],
      },
      ordensServico: {
        total: 0,
        canceladas: 0,
        concluidas: 0,
        taxa: 0,
        valorCancelado: 0,
        valorConcluido: 0,
        porCliente: [],
      },
    },
    eficienciaProducao: {
      rapidas: 0,
      moderadas: 0,
      lentas: 0,
      total: 0,
      percentualRapidas: 0,
    },
    parametros: {},
  });

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

  const empresaConfig = JSON.parse(localStorage.getItem("config"));

  function handleClose() {
    setOpen(false);
  }

  const fetchData = () => {
    fullScreenLoader.setLoading(true);
    api
      .get(
        `/relatorios/analise-operacional?from=${moment(
          state[0].startDate
        ).format("YYYY-MM-DD")}&to=${moment(state[0].endDate).format(
          "YYYY-MM-DD"
        )}`
      )
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [state]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: empresaConfig?.moeda || "BRL",
    }).format(value || 0);
  };

  return (
    <>
      <Dialog
        fullWidth={false}
        maxWidth="lg"
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          sx={{ color: theme.colors.text, backgroundColor: theme.colors.body }}
        >
          Selecione o período
        </DialogTitle>
        <DialogContent
          sx={{ color: theme.colors.text, backgroundColor: theme.colors.body }}
        >
          <DateRangePicker
            onChange={(item) => setState([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={state}
            direction="horizontal"
            locale={locales.pt}
            dateDisplayFormat="dd/MM/yyyy"
            staticRanges={defaultStaticRanges}
            inputRanges={defaultInputRanges}
          />
        </DialogContent>
        <DialogActions
          sx={{ color: theme.colors.text, backgroundColor: theme.colors.body }}
        >
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Box p={3}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" sx={{ color: theme.colors.text }}>
            Análise Operacional
          </Typography>
          <Button
            variant="contained"
            startIcon={<CalendarMonthIcon />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: theme.colors.primary,
              color: "#fff",
              "&:hover": {
                backgroundColor: theme.colors.primary,
                opacity: 0.9,
              },
            }}
          >
            {moment(state[0].startDate).format("DD/MM/YYYY")} -{" "}
            {moment(state[0].endDate).format("DD/MM/YYYY")}
          </Button>
        </Box>

        {/* Cards Lead Time */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ backgroundColor: theme?.colors?.body }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                      Lead Time Médio
                    </Typography>
                    <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                      {data.leadTime.medio} dias
                    </Typography>
                  </Box>
                  <TimerIcon style={{ fontSize: 50, color: theme?.colors?.primary || "#1976d2" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ backgroundColor: theme?.colors?.body }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                      Lead Time Mínimo
                    </Typography>
                    <Typography variant="h4" style={{ color: "#4caf50" }}>
                      {data.leadTime.minimo} dias
                    </Typography>
                  </Box>
                  <SpeedIcon style={{ fontSize: 50, color: "#4caf50" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ backgroundColor: theme?.colors?.body }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                      Lead Time Máximo
                    </Typography>
                    <Typography variant="h4" style={{ color: "#ff9800" }}>
                      {data.leadTime.maximo} dias
                    </Typography>
                  </Box>
                  <TimerIcon style={{ fontSize: 50, color: "#ff9800" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ backgroundColor: theme?.colors?.body }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                      OF Concluídas
                    </Typography>
                    <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                      {data.leadTime.totalConcluidas}
                    </Typography>
                  </Box>
                  <CheckCircleIcon style={{ fontSize: 50, color: theme?.colors?.primary || "#1976d2" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Distribuição de Lead Time por Faixas */}
        <Card style={{ backgroundColor: theme?.colors?.body }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Distribuição de Lead Time por Faixas
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <Grid container spacing={2}>
              {data.leadTime.faixas.map((faixa, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    p={2}
                    style={{
                      backgroundColor: theme?.colors?.card,
                      borderRadius: "4px",
                      border: `1px solid ${theme?.colors?.primary}`,
                    }}
                  >
                    <Typography variant="body1" style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      {faixa.faixa}
                    </Typography>
                    <Typography variant="h5" style={{ color: theme?.colors?.primary }}>
                      {faixa.quantidade} OF
                    </Typography>
                    <Typography variant="body2" style={{ color: theme?.colors?.text }}>
                      Valor médio: {formatCurrency(faixa.valor_medio)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Cards Taxa de Cancelamento */}
        <Typography variant="h5" style={{ color: theme?.colors?.text, marginTop: "24px", marginBottom: "16px" }}>
          Taxa de Cancelamento
        </Typography>
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card style={{ backgroundColor: theme?.colors?.body }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CancelIcon style={{ color: "#f44336", marginRight: "8px" }} />
                  <Typography variant="h6" style={{ color: theme?.colors?.text }}>
                    Vendas
                  </Typography>
                </Box>
                <Typography variant="h3" style={{ color: "#f44336", marginBottom: "16px" }}>
                  {data.taxaCancelamento.vendas.taxa}%
                </Typography>
                <Divider style={{ marginBottom: "16px" }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: theme.colors.text }}>
                      Total de Vendas
                    </Typography>
                    <Typography variant="h6" sx={{ color: theme.colors.text }}>
                      {data.taxaCancelamento.vendas.total}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" style={{ color: theme?.colors?.text, opacity: 0.7 }}>
                      Canceladas
                    </Typography>
                    <Typography variant="h6" style={{ color: "#f44336" }}>
                      {data.taxaCancelamento.vendas.canceladas}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" style={{ color: theme?.colors?.text, opacity: 0.7 }}>
                      Valor Cancelado
                    </Typography>
                    <Typography variant="body1" style={{ color: "#f44336" }}>
                      {formatCurrency(data.taxaCancelamento.vendas.valorCancelado)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" style={{ color: theme?.colors?.text, opacity: 0.7 }}>
                      Valor Concluído
                    </Typography>
                    <Typography variant="body1" style={{ color: "#4caf50" }}>
                      {formatCurrency(data.taxaCancelamento.vendas.valorConcluido)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card style={{ backgroundColor: theme?.colors?.body }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CancelIcon style={{ color: "#f44336", marginRight: "8px" }} />
                  <Typography variant="h6" style={{ color: theme?.colors?.text }}>
                    Ordens de Serviço
                  </Typography>
                </Box>
                <Typography variant="h3" style={{ color: "#f44336", marginBottom: "16px" }}>
                  {data.taxaCancelamento.ordensServico.taxa}%
                </Typography>
                <Divider style={{ marginBottom: "16px" }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" style={{ color: theme?.colors?.text, opacity: 0.7 }}>
                      Total de OF
                    </Typography>
                    <Typography variant="h6" style={{ color: theme?.colors?.text }}>
                      {data.taxaCancelamento.ordensServico.total}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" style={{ color: theme?.colors?.text, opacity: 0.7 }}>
                      Canceladas
                    </Typography>
                    <Typography variant="h6" style={{ color: "#f44336" }}>
                      {data.taxaCancelamento.ordensServico.canceladas}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" style={{ color: theme?.colors?.text, opacity: 0.7 }}>
                      Valor Cancelado
                    </Typography>
                    <Typography variant="body1" style={{ color: "#f44336" }}>
                      {formatCurrency(data.taxaCancelamento.ordensServico.valorCancelado)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" style={{ color: theme?.colors?.text, opacity: 0.7 }}>
                      Valor Concluído
                    </Typography>
                    <Typography variant="body1" style={{ color: "#4caf50" }}>
                      {formatCurrency(data.taxaCancelamento.ordensServico.valorConcluido)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Eficiência de Produção */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Eficiência de Produção
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box
                  p={2}
                  style={{
                    backgroundColor: "#4caf50",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" style={{ color: "#fff" }}>
                    {data.eficienciaProducao.rapidas}
                  </Typography>
                  <Typography variant="body1" style={{ color: "#fff" }}>
                    OF Rápidas (até 3 dias)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  p={2}
                  style={{
                    backgroundColor: "#ff9800",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" style={{ color: "#fff" }}>
                    {data.eficienciaProducao.moderadas}
                  </Typography>
                  <Typography variant="body1" style={{ color: "#fff" }}>
                    OF Moderadas (4-7 dias)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  p={2}
                  style={{
                    backgroundColor: "#f44336",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4" style={{ color: "#fff" }}>
                    {data.eficienciaProducao.lentas}
                  </Typography>
                  <Typography variant="body1" style={{ color: "#fff" }}>
                    OF Lentas (mais de 7 dias)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography variant="body1" style={{ color: theme?.colors?.text }}>
                Percentual de OF Rápidas: <strong>{data.eficienciaProducao.percentualRapidas}%</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Top 10 OS com maior Lead Time */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Top 10 OF com Maior Lead Time
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <TableContainer component={Paper} style={{ backgroundColor: theme?.colors?.body }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: theme?.colors?.card }}>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Número OF
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Cliente
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Data Entrada
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Data Saída
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Lead Time (dias)
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Valor Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.leadTime.topLeadTime.map((row, index) => (
                    <TableRow key={index} style={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.numero}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.cliente_nome}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {moment(row.dataEntrada).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {moment(row.dataSaida).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        <Chip
                          label={`${row.lead_time_dias} dias`}
                          style={{
                            backgroundColor:
                              row.lead_time_dias > 15
                                ? "#f44336"
                                : row.lead_time_dias > 7
                                ? "#ff9800"
                                : "#4caf50",
                            color: "#fff",
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {formatCurrency(row.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Vendas Canceladas por Cliente */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Top 20 Clientes com Vendas Canceladas
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <TableContainer component={Paper} style={{ backgroundColor: theme?.colors?.body }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: theme?.colors?.card }}>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Cliente
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Total Canceladas
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Valor Total Cancelado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.taxaCancelamento.vendas.porCliente.map((row, index) => (
                    <TableRow key={index} style={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.cliente_nome}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.total_canceladas}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {formatCurrency(row.valor_total_cancelado)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* OS Canceladas por Cliente */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Top 20 Clientes com OF Canceladas
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <TableContainer component={Paper} style={{ backgroundColor: theme?.colors?.body }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: theme?.colors?.card }}>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Cliente
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Total Canceladas
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Valor Total Cancelado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.taxaCancelamento.ordensServico.porCliente.map((row, index) => (
                    <TableRow key={index} style={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.cliente_nome}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.total_canceladas}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {formatCurrency(row.valor_total_cancelado)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default AnaliseOperacional;

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
import WarningIcon from "@mui/icons-material/Warning";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function AnaliseFinanceira() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    transacoesEmAtraso: [],
    inadimplenciaPorCliente: [],
    faixasResumo: {},
    estatisticas: {},
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
        `/relatorios/analise-financeira?startDate=${moment(
          state[0].startDate
        ).format("YYYY-MM-DD")}&endDate=${moment(state[0].endDate).format(
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
      currency: "BRL",
      minimumFractionDigits: empresaConfig?.quantidadeCasasDecimaisValor || 2,
      maximumFractionDigits: empresaConfig?.quantidadeCasasDecimaisValor || 2,
    }).format(parseFloat(value || 0));
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const getFaixaColor = (faixa) => {
    switch (faixa) {
      case "ate_30_dias":
        return "#ff9800";
      case "31_a_60_dias":
        return "#f57c00";
      case "61_a_90_dias":
        return "#e65100";
      case "acima_90_dias":
        return "#d32f2f";
      default:
        return "#9e9e9e";
    }
  };

  const getFaixaLabel = (faixa) => {
    switch (faixa) {
      case "ate_30_dias":
        return "Até 30 dias";
      case "31_a_60_dias":
        return "31 a 60 dias";
      case "61_a_90_dias":
        return "61 a 90 dias";
      case "acima_90_dias":
        return "Acima de 90 dias";
      default:
        return "";
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Cabeçalho */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" style={{ color: theme?.colors?.text }}>
              Análise Financeira - Inadimplência
            </Typography>
            <Button
              variant="contained"
              startIcon={<CalendarMonthIcon />}
              onClick={() => setOpen(true)}
              style={{
                backgroundColor: theme?.colors?.primary || "#1976d2",
                color: "#fff",
              }}
            >
              {moment(state[0].startDate).format("DD/MM/YYYY")} -{" "}
              {moment(state[0].endDate).format("DD/MM/YYYY")}
            </Button>
          </Box>
        </Grid>

        {/* Cards de Estatísticas */}
        <Grid item xs={12} md={3}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Parcelas Atrasadas
                  </Typography>
                  <Typography variant="h4" style={{ color: "#f44336" }}>
                    {data.estatisticas.total_transacoes_atrasadas || 0}
                  </Typography>
                </Box>
                <WarningIcon style={{ fontSize: 50, color: "#f44336" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Valor Total
                  </Typography>
                  <Typography variant="h5" style={{ color: "#d32f2f" }}>
                    {formatCurrency(data.estatisticas.valor_total_inadimplencia)}
                  </Typography>
                </Box>
                <MoneyOffIcon style={{ fontSize: 50, color: "#d32f2f" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Clientes Inadimplentes
                  </Typography>
                  <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                    {data.estatisticas.total_clientes_inadimplentes || 0}
                  </Typography>
                </Box>
                <PeopleIcon style={{ fontSize: 50, color: theme?.colors?.primary || "#1976d2" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Maior Atraso
                  </Typography>
                  <Typography variant="h4" style={{ color: "#ff9800" }}>
                    {data.estatisticas.maior_atraso_dias || 0} dias
                  </Typography>
                </Box>
                <AccessTimeIcon style={{ fontSize: 50, color: "#ff9800" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Faixas de Atraso */}
        <Grid item xs={12}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
                Classificação por Faixa de Atraso
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              <Grid container spacing={2}>
                {Object.keys(data.faixasResumo).map((faixa) => (
                  <Grid item xs={12} sm={6} md={3} key={faixa}>
                    <Card style={{ backgroundColor: getFaixaColor(faixa), color: "#fff" }}>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          {getFaixaLabel(faixa)}
                        </Typography>
                        <Typography variant="h5">
                          {data.faixasResumo[faixa]?.quantidade || 0} parcelas
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(data.faixasResumo[faixa]?.valor_total)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Inadimplência por Cliente */}
        <Grid item xs={12}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
                <PeopleIcon style={{ verticalAlign: "middle", marginRight: 8 }} />
                Inadimplência por Cliente
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              <TableContainer component={Paper} style={{ maxHeight: 400 }} sx={{ backgroundColor: theme?.colors?.body }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Cliente</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Parcelas</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Valor Total</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Maior Atraso</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Vencimento Mais Antigo</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.inadimplenciaPorCliente.map((cliente) => (
                      <TableRow key={cliente.cliente_id} sx={{ backgroundColor: theme?.colors?.body }}>
                        <TableCell sx={{ color: theme?.colors?.text }}>{cliente.cliente_nome}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>
                          <Chip
                            label={cliente.total_parcelas_atrasadas}
                            color="error"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatCurrency(cliente.valor_total_atraso)}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>
                          <Chip
                            label={`${cliente.maior_atraso_dias} dias`}
                            style={{ 
                              backgroundColor: cliente.maior_atraso_dias > 90 ? "#d32f2f" : cliente.maior_atraso_dias > 60 ? "#f57c00" : "#ff9800",
                              color: "#fff"
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatDate(cliente.vencimento_mais_antigo)}</TableCell>
                      </TableRow>
                    ))}
                    {data.inadimplenciaPorCliente.length === 0 && (
                      <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                        <TableCell colSpan={5} align="center" sx={{ color: theme?.colors?.text }}>
                          Nenhum cliente inadimplente
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Transações em Atraso */}
        <Grid item xs={12}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
                <WarningIcon style={{ verticalAlign: "middle", marginRight: 8 }} />
                Todas as Parcelas em Atraso
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              <TableContainer component={Paper} style={{ maxHeight: 500 }} sx={{ backgroundColor: theme?.colors?.body }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Cliente</strong></TableCell>
                      <TableCell sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Observação</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Vencimento</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Valor</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Dias de Atraso</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.transacoesEmAtraso.map((transacao) => (
                      <TableRow key={transacao.id} sx={{ backgroundColor: theme?.colors?.body }}>
                        <TableCell sx={{ color: theme?.colors?.text }}>{transacao.cliente_nome}</TableCell>
                        <TableCell sx={{ color: theme?.colors?.text }}>{transacao.observacao}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatDate(transacao.data_vencimento)}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatCurrency(transacao.valor)}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>
                          <Chip
                            label={`${transacao.dias_atraso} dias`}
                            style={{ 
                              backgroundColor: transacao.dias_atraso > 90 ? "#d32f2f" : transacao.dias_atraso > 60 ? "#e65100" : transacao.dias_atraso > 30 ? "#f57c00" : "#ff9800",
                              color: "#fff"
                            }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {data.transacoesEmAtraso.length === 0 && (
                      <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                        <TableCell colSpan={5} align="center" sx={{ color: theme?.colors?.text }}>
                          Nenhuma parcela em atraso
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog para seleção de data */}
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
    </>
  );
}

export default AnaliseFinanceira;

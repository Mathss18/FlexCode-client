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
  TextField,
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RepeatIcon from "@mui/icons-material/Repeat";

function AnaliseClientes() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [diasInatividade, setDiasInatividade] = useState(90);
  const [data, setData] = useState({
    topClientes: [],
    clientesInativos: [],
    ticketMedio: [],
    recorrencia: [],
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
        `/relatorios/analise-clientes?startDate=${moment(
          state[0].startDate
        ).format("YYYY-MM-DD")}&endDate=${moment(state[0].endDate).format(
          "YYYY-MM-DD"
        )}&diasInatividade=${diasInatividade}`
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
    if (!open) {
      fetchData();
    }
  }, [open, diasInatividade]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: empresaConfig?.quantidadeCasasDecimaisValor || 2,
      maximumFractionDigits: empresaConfig?.quantidadeCasasDecimaisValor || 2
    }).format(parseFloat(value || 0));
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Cabeçalho com filtros */}
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: "20px" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Análise de Clientes
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Dias de Inatividade"
            value={diasInatividade}
            onChange={(e) => setDiasInatividade(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<CalendarMonthIcon />}
            onClick={() => setOpen(true)}
            style={{ height: "56px" }}
          >
            {moment(state[0].startDate).format("DD/MM/YYYY")} -{" "}
            {moment(state[0].endDate).format("DD/MM/YYYY")}
          </Button>
        </Grid>
      </Grid>

      {/* Cards de Estatísticas */}
      <Grid container spacing={2} style={{ marginBottom: "30px" }}>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Clientes Ativos
                  </Typography>
                  <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                    {data.estatisticas.total_clientes_ativos || 0}
                  </Typography>
                </Box>
                <GroupIcon style={{ fontSize: 50, color: theme?.colors?.primary || "#1976d2" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Clientes Inativos
                  </Typography>
                  <Typography variant="h4" style={{ color: "#f44336" }}>
                    {data.estatisticas.total_clientes_inativos || 0}
                  </Typography>
                </Box>
                <GroupIcon style={{ fontSize: 50, color: "#f44336" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Ticket Médio Geral
                  </Typography>
                  <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                    {formatCurrency(data.estatisticas.ticket_medio_geral)}
                  </Typography>
                </Box>
                <TrendingUpIcon style={{ fontSize: 50, color: theme?.colors?.primary || "#ff9800" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Clientes por Faturamento */}
      <Card style={{ marginBottom: "20px", backgroundColor: theme?.colors?.body }}>
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ display: "flex", alignItems: "center", color: theme?.colors?.text }}>
            <TrendingUpIcon style={{ marginRight: "10px", color: theme?.colors?.primary }} />
            Top 20 Clientes por Faturamento
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <TableContainer component={Paper} sx={{ backgroundColor: theme?.colors?.body }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                  <TableCell sx={{ color: theme?.colors?.text }}><strong>Posição</strong></TableCell>
                  <TableCell sx={{ color: theme?.colors?.text }}><strong>Cliente</strong></TableCell>
                  <TableCell align="right" sx={{ color: theme?.colors?.text }}><strong>Total Vendas</strong></TableCell>
                  <TableCell align="right" sx={{ color: theme?.colors?.text }}><strong>Faturamento</strong></TableCell>
                  <TableCell align="right" sx={{ color: theme?.colors?.text }}><strong>Ticket Médio</strong></TableCell>
                  <TableCell align="right" sx={{ color: theme?.colors?.text }}><strong>Última Compra</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topClientes.map((cliente, index) => (
                  <TableRow key={cliente.id} sx={{ backgroundColor: theme?.colors?.body }}>
                    <TableCell sx={{ color: theme?.colors?.text }}>
                      <Chip
                        label={index + 1}
                        color={index === 0 ? "primary" : index === 1 ? "secondary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: theme?.colors?.text }}>{cliente.nome}</TableCell>
                    <TableCell align="right" sx={{ color: theme?.colors?.text }}>{cliente.total_vendas}</TableCell>
                    <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatCurrency(cliente.faturamento_total)}</TableCell>
                    <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatCurrency(cliente.ticket_medio)}</TableCell>
                    <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatDate(cliente.ultima_compra)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Clientes Inativos */}
      <Card style={{ marginBottom: "20px", backgroundColor: theme?.colors?.body }}>
        <CardContent>
          <Typography variant="h6" gutterBottom style={{ display: "flex", alignItems: "center", color: theme?.colors?.text }}>
            <GroupIcon style={{ marginRight: "10px", color: "#f44336" }} />
            Clientes Inativos (mais de {diasInatividade} dias sem comprar)
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <TableContainer component={Paper} sx={{ backgroundColor: theme?.colors?.body }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                  <TableCell sx={{ color: theme?.colors?.text }}><strong>Cliente</strong></TableCell>
                  <TableCell sx={{ color: theme?.colors?.text }}><strong>Email</strong></TableCell>
                  <TableCell sx={{ color: theme?.colors?.text }}><strong>Telefone</strong></TableCell>
                  <TableCell align="right" sx={{ color: theme?.colors?.text }}><strong>Última Compra</strong></TableCell>
                  <TableCell align="right" sx={{ color: theme?.colors?.text }}><strong>Total Compras (Histórico)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.clientesInativos.map((cliente) => (
                  <TableRow key={cliente.id} sx={{ backgroundColor: theme?.colors?.body }}>
                    <TableCell sx={{ color: theme?.colors?.text }}>{cliente.nome}</TableCell>
                    <TableCell sx={{ color: theme?.colors?.text }}>{cliente.email}</TableCell>
                    <TableCell sx={{ color: theme?.colors?.text }}>{cliente.telefone}</TableCell>
                    <TableCell align="right" sx={{ color: theme?.colors?.text }}>
                      {cliente.ultima_compra ? formatDate(cliente.ultima_compra) : "Nunca"}
                    </TableCell>
                    <TableCell align="right" sx={{ color: theme?.colors?.text }}>{cliente.total_compras_historico}</TableCell>
                  </TableRow>
                ))}
                {data.clientesInativos.length === 0 && (
                  <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                    <TableCell colSpan={5} align="center" sx={{ color: theme?.colors?.text }}>
                      Nenhum cliente inativo encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Grid com Ticket Médio e Recorrência */}
      <Grid container spacing={2}>
        {/* Ticket Médio */}
        <Grid item xs={12} md={6}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Typography variant="h6" gutterBottom style={{ display: "flex", alignItems: "center", color: theme?.colors?.text }}>
                <AttachMoneyIcon style={{ marginRight: "10px", color: theme?.colors?.primary }} />
                Ticket Médio por Cliente
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              <TableContainer component={Paper} style={{ maxHeight: 400 }} sx={{ backgroundColor: theme?.colors?.body }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Cliente</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Vendas</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Total</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Ticket Médio</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.ticketMedio.map((cliente) => (
                      <TableRow key={cliente.id} sx={{ backgroundColor: theme?.colors?.body }}>
                        <TableCell sx={{ color: theme?.colors?.text }}>{cliente.nome}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{cliente.total_vendas}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatCurrency(cliente.total_gasto)}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>
                          <strong>{formatCurrency(cliente.ticket_medio)}</strong>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Análise de Recorrência */}
        <Grid item xs={12} md={6}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Typography variant="h6" gutterBottom style={{ display: "flex", alignItems: "center", color: theme?.colors?.text }}>
                <RepeatIcon style={{ marginRight: "10px", color: theme?.colors?.primary }} />
                Análise de Recorrência
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              <TableContainer component={Paper} style={{ maxHeight: 400 }} sx={{ backgroundColor: theme?.colors?.body }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Cliente</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Compras</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Intervalo Médio (dias)</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Total Gasto</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recorrencia.map((cliente) => (
                      <TableRow key={cliente.id} sx={{ backgroundColor: theme?.colors?.body }}>
                        <TableCell sx={{ color: theme?.colors?.text }}>{cliente.nome}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>
                          <Chip label={cliente.total_vendas} color="primary" size="small" />
                        </TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>
                          {Math.round(cliente.intervalo_medio_dias)} dias
                        </TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatCurrency(cliente.total_gasto)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Seleção de Data */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Selecione o período</DialogTitle>
        <DialogContent>
          <DateRangePicker
            onChange={(item) => setState([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={state}
            direction="horizontal"
            staticRanges={defaultStaticRanges}
            inputRanges={defaultInputRanges}
            locale={locales["pt"]}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AnaliseClientes;

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
import InventoryIcon from "@mui/icons-material/Inventory";
import ShowChartIcon from "@mui/icons-material/ShowChart";

function AnaliseProdutos() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    produtosMaisVendidos: [],
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
        `/relatorios/analise-produtos?startDate=${moment(
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

  const formatPercentage = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(value || 0) / 100);
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Cabeçalho */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" style={{ color: theme?.colors?.text }}>
              Análise de Produtos
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
        <Grid item xs={12} md={6}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Produtos Vendidos
                  </Typography>
                  <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                    {data.estatisticas.total_produtos_vendidos || 0}
                  </Typography>
                </Box>
                <InventoryIcon style={{ fontSize: 50, color: theme?.colors?.primary || "#1976d2" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                    Quantidade Total
                  </Typography>
                  <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                    {data.estatisticas.quantidade_total_vendida || 0}
                  </Typography>
                </Box>
                <ShowChartIcon style={{ fontSize: 50, color: theme?.colors?.primary || "#1976d2" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Produtos Mais Vendidos */}
        <Grid item xs={12}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
                <InventoryIcon style={{ verticalAlign: "middle", marginRight: 8 }} />
                Top 50 Produtos Mais Vendidos
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              <TableContainer component={Paper} style={{ maxHeight: 400 }} sx={{ backgroundColor: theme?.colors?.body }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Posição</strong></TableCell>
                      <TableCell sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Produto</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Qtd. Vendida</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Valor Total</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Preço Médio</strong></TableCell>
                      <TableCell align="right" sx={{ color: theme?.colors?.text, backgroundColor: theme?.colors?.body }}><strong>Nº Vendas</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.produtosMaisVendidos.map((produto, index) => (
                      <TableRow key={produto.id} sx={{ backgroundColor: theme?.colors?.body }}>
                        <TableCell sx={{ color: theme?.colors?.text }}>
                          <Chip
                            label={index + 1}
                            color={index === 0 ? "primary" : index === 1 ? "secondary" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: theme?.colors?.text }}>{produto.nome}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{produto.quantidade_vendida}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatCurrency(produto.valor_total_vendido)}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{formatCurrency(produto.preco_medio_venda)}</TableCell>
                        <TableCell align="right" sx={{ color: theme?.colors?.text }}>{produto.numero_vendas}</TableCell>
                      </TableRow>
                    ))}
                    {data.produtosMaisVendidos.length === 0 && (
                      <TableRow sx={{ backgroundColor: theme?.colors?.body }}>
                        <TableCell colSpan={6} align="center" sx={{ color: theme?.colors?.text }}>
                          Nenhum dado encontrado
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

export default AnaliseProdutos;

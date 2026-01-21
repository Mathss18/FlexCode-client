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
import BusinessIcon from "@mui/icons-material/Business";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

function AnaliseFornecedores() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    topFornecedores: [],
    estatisticasGerais: {
      total_fornecedores_ativos: 0,
      total_compras: 0,
      valor_total_compras: 0,
      ticket_medio_geral: 0,
    },
    analisePrecos: [],
    prazoEntrega: [],
    distribuicaoPrazos: [],
    produtosMaisComprados: [],
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
        `/relatorios/analise-fornecedores?from=${moment(
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
            Análise de Fornecedores
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

        {/* Cards Estatísticas Gerais */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ backgroundColor: theme?.colors?.body }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }} gutterBottom>
                      Fornecedores Ativos
                    </Typography>
                    <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                      {data.estatisticasGerais.total_fornecedores_ativos}
                    </Typography>
                  </Box>
                  <BusinessIcon style={{ fontSize: 50, color: theme?.colors?.primary || "#1976d2" }} />
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
                      Total de Compras
                    </Typography>
                    <Typography variant="h4" style={{ color: theme?.colors?.text }}>
                      {data.estatisticasGerais.total_compras}
                    </Typography>
                  </Box>
                  <ShoppingCartIcon style={{ fontSize: 50, color: "#4caf50" }} />
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
                      Valor Total
                    </Typography>
                    <Typography variant="h5" style={{ color: "#2196f3" }}>
                      {formatCurrency(data.estatisticasGerais.valor_total_compras)}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon style={{ fontSize: 50, color: "#2196f3" }} />
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
                      Ticket Médio
                    </Typography>
                    <Typography variant="h5" style={{ color: "#ff9800" }}>
                      {formatCurrency(data.estatisticasGerais.ticket_medio_geral)}
                    </Typography>
                  </Box>
                  <AttachMoneyIcon style={{ fontSize: 50, color: "#ff9800" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Top Fornecedores por Volume de Compra */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Top 20 Fornecedores por Volume de Compra
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <TableContainer component={Paper} style={{ backgroundColor: theme?.colors?.body }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: theme?.colors?.card }}>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Fornecedor
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Total Compras
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Valor Total
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Ticket Médio
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topFornecedores.map((row, index) => (
                    <TableRow key={index} style={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.fornecedor_nome}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.total_compras}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {formatCurrency(row.valor_total)}
                      </TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {formatCurrency(row.ticket_medio)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Prazos de Entrega */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Distribuição de Prazos de Entrega
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <Grid container spacing={2}>
              {data.distribuicaoPrazos.map((faixa, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
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
                      {faixa.quantidade} compras
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

        {/* Prazo Médio de Entrega por Fornecedor */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Prazo Médio de Entrega por Fornecedor
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <TableContainer component={Paper} style={{ backgroundColor: theme?.colors?.body }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: theme?.colors?.card }}>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Fornecedor
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Prazo Médio (dias)
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Prazo Mínimo (dias)
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Prazo Máximo (dias)
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Total Compras
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.prazoEntrega.map((row, index) => (
                    <TableRow key={index} style={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.fornecedor_nome}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        <Typography
                          variant="body2"
                          style={{
                            color:
                              row.prazo_medio_dias <= 7
                                ? "#4caf50"
                                : row.prazo_medio_dias <= 15
                                ? "#ff9800"
                                : "#f44336",
                            fontWeight: "bold",
                          }}
                        >
                          {row.prazo_medio_dias} dias
                        </Typography>
                      </TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.prazo_minimo}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.prazo_maximo}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.total_compras}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Análise de Preços por Produto */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Comparação de Preços - Produtos com Múltiplos Fornecedores
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            {data.analisePrecos.length === 0 ? (
              <Typography variant="body1" style={{ color: theme?.colors?.text, textAlign: "center", padding: "20px" }}>
                Nenhum produto foi comprado de múltiplos fornecedores no período selecionado.
              </Typography>
            ) : (
              data.analisePrecos.map((produto, index) => (
                <Box key={index} mb={3}>
                  <Typography variant="subtitle1" style={{ color: theme?.colors?.text, fontWeight: "bold", marginBottom: "8px" }}>
                    {produto.produto_codigo} - {produto.produto_nome}
                  </Typography>
                  <TableContainer component={Paper} style={{ backgroundColor: theme?.colors?.body }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow style={{ backgroundColor: theme?.colors?.card }}>
                          <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                            Fornecedor
                          </TableCell>
                          <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                            Preço Médio
                          </TableCell>
                          <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                            Preço Mínimo
                          </TableCell>
                          <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                            Preço Máximo
                          </TableCell>
                          <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                            Quantidade Total
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {produto.fornecedores.map((fornecedor, fIndex) => (
                          <TableRow key={fIndex} style={{ backgroundColor: theme?.colors?.body }}>
                            <TableCell style={{ color: theme?.colors?.text }}>{fornecedor.fornecedor_nome}</TableCell>
                            <TableCell style={{ color: theme?.colors?.text }}>
                              {formatCurrency(fornecedor.preco_medio)}
                            </TableCell>
                            <TableCell style={{ color: theme?.colors?.text }}>
                              {formatCurrency(fornecedor.preco_minimo)}
                            </TableCell>
                            <TableCell style={{ color: theme?.colors?.text }}>
                              {formatCurrency(fornecedor.preco_maximo)}
                            </TableCell>
                            <TableCell style={{ color: theme?.colors?.text }}>
                              {fornecedor.quantidade_total}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))
            )}
          </CardContent>
        </Card>

        {/* Produtos Mais Comprados */}
        <Card style={{ backgroundColor: theme?.colors?.body, marginBottom: "24px" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: theme?.colors?.text }} gutterBottom>
              Top 20 Produtos Mais Comprados
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <TableContainer component={Paper} style={{ backgroundColor: theme?.colors?.body }}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: theme?.colors?.card }}>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Produto
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Quantidade Total
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Nº Fornecedores
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Preço Médio
                    </TableCell>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: "bold" }}>
                      Valor Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.produtosMaisComprados.map((row, index) => (
                    <TableRow key={index} style={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {row.produto_codigo} - {row.produto_nome}
                      </TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.quantidade_total}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>{row.numero_fornecedores}</TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {formatCurrency(row.preco_medio)}
                      </TableCell>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {formatCurrency(row.valor_total)}
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

export default AnaliseFornecedores;

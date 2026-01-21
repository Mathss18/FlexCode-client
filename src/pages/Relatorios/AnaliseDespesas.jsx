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
  LinearProgress,
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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function AnaliseDespesas() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const { theme } = useTheme();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFavorecido, setSelectedFavorecido] = useState(null);
  const [data, setData] = useState({
    estatisticas: {
      total_despesas: 0,
      total_transacoes: 0,
      ticket_medio: 0,
      total_favorecidos: 0,
      meses_com_despesas: 0,
    },
    evolucaoMensal: [],
    despesasPorCategoria: [],
    evolucaoMensalCategoria: [],
    topFavorecidos: [],
    despesasPorSituacao: [],
    transacaoPorMes: [],
    sugestoesDespesas: [],
  });

  const [selectionRange, setSelectionRange] = useState({
    startDate: moment().subtract(11, "months").startOf("month").toDate(),
    endDate: moment().endOf("month").toDate(),
    key: "selection",
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: empresaConfig?.moeda || "BRL",
    }).format(value || 0);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      fornecedores: "Fornecedores",
      funcionarios: "Funcionários",
      outros_favorecidos: "Outros Favorecidos",
      transportadoras: "Transportadoras",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      fornecedores: "#FF6384",
      funcionarios: "#36A2EB",
      outros_favorecidos: "#FFCE56",
      transportadoras: "#4BC0C0",
    };
    return colors[category] || "#999";
  };

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async (search = searchTerm, favorecidoId = selectedFavorecido?.favorecido_id, favorecidoNome = selectedFavorecido?.favorecido_nome) => {
    try {
      fullScreenLoader.setLoading(true);
      const from = moment(selectionRange.startDate).format("YYYY-MM-DD");
      const to = moment(selectionRange.endDate).format("YYYY-MM-DD");
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const favorecidoParam = favorecidoId ? `&favorecido_id=${favorecidoId}` : "";
      const nomeParam = favorecidoNome ? `&favorecido_nome=${encodeURIComponent(favorecidoNome)}` : "";

      const response = await api.get(
        `/relatorios/analise-despesas?from=${from}&to=${to}${searchParam}${favorecidoParam}${nomeParam}`
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      fullScreenLoader.setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Header = () => {
    return (
      <Box
        style={{ backgroundColor: theme?.colors?.body }}
        sx={{
          p: 2,
          borderRadius: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: theme?.colors?.text, fontWeight: 600 }}>
            Pra onde vai meu dinheiro
          </Typography>
          <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }}>
            Análise detalhada de despesas por categoria
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CalendarMonthIcon />}
          onClick={() => setOpen(true)}
        >
          {moment(selectionRange.startDate).format("DD/MM/YYYY")} -{" "}
          {moment(selectionRange.endDate).format("DD/MM/YYYY")}
        </Button>
      </Box>
    );
  };

  return (
    <Box>
      <Header />

      {/* Cards de Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7, fontSize: 14 }}>
                    Total de Despesas
                  </Typography>
                  <Typography variant="h5" sx={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    {formatCurrency(data?.estatisticas?.total_despesas)}
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 40, color: theme?.colors?.primary, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7, fontSize: 14 }}>
                    Total de Transações
                  </Typography>
                  <Typography variant="h5" sx={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    {data?.estatisticas?.total_transacoes || 0}
                  </Typography>
                </Box>
                <ReceiptLongIcon sx={{ fontSize: 40, color: theme?.colors?.primary, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7, fontSize: 14 }}>
                    Ticket Médio
                  </Typography>
                  <Typography variant="h5" sx={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    {formatCurrency(data?.estatisticas?.ticket_medio)}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: theme?.colors?.primary, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ backgroundColor: theme?.colors?.body }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7, fontSize: 14 }}>
                    Total de Favorecidos
                  </Typography>
                  <Typography variant="h5" sx={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    {data?.estatisticas?.total_favorecidos || 0}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: theme?.colors?.primary, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Feedbacks Dinâmicos */}
      {data?.evolucaoMensal?.length >= 2 && (
        <Card style={{ backgroundColor: theme?.colors?.body }} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 2 }}>
              💡 Insights
            </Typography>
            <Grid container spacing={2}>
              {(() => {
                const ultimoMes = data.evolucaoMensal[0];
                const penultimoMes = data.evolucaoMensal[1];
                const variacao = ((ultimoMes.total - penultimoMes.total) / penultimoMes.total) * 100;
                const maiorGasto = data.despesasPorCategoria?.[0];
                const mediaMensal = data.evolucaoMensal.reduce((sum, m) => sum + parseFloat(m.total), 0) / data.evolucaoMensal.length;

                return (
                  <>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, borderRadius: 1, backgroundColor: variacao > 0 ? "#ff634820" : "#4caf5020", borderLeft: `4px solid ${variacao > 0 ? "#f44336" : "#4caf50"}` }}>
                        <Typography sx={{ color: theme?.colors?.text, fontSize: 14, mb: 1 }}>
                          Tendência Mensal
                        </Typography>
                        <Typography sx={{ color: theme?.colors?.text, fontWeight: 600, fontSize: 16 }}>
                          {variacao > 0 ? "📈 Aumentou" : "📉 Reduziu"} {Math.abs(variacao).toFixed(1)}% vs mês anterior
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, borderRadius: 1, backgroundColor: "#36a2eb20", borderLeft: "4px solid #36A2EB" }}>
                        <Typography sx={{ color: theme?.colors?.text, fontSize: 14, mb: 1 }}>
                          Maior Categoria de Gasto
                        </Typography>
                        <Typography sx={{ color: theme?.colors?.text, fontWeight: 600, fontSize: 16 }}>
                          {getCategoryLabel(maiorGasto?.categoria)} - {maiorGasto?.percentual}%
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ p: 2, borderRadius: 1, backgroundColor: "#ffce5620", borderLeft: "4px solid #FFCE56" }}>
                        <Typography sx={{ color: theme?.colors?.text, fontSize: 14, mb: 1 }}>
                          Média Mensal
                        </Typography>
                        <Typography sx={{ color: theme?.colors?.text, fontWeight: 600, fontSize: 16 }}>
                          {formatCurrency(mediaMensal)}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                );
              })()}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Busca por Transação */}
      <Card style={{ backgroundColor: theme?.colors?.body }} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 2 }}>
            🔍 Comparar Despesa Específica
          </Typography>
          
          {!selectedFavorecido && (
            <>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <input
                  type="text"
                  placeholder="Digite o nome do favorecido (ex: Gilberto Santos, CPFL...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchTerm) {
                      fetchData(searchTerm, null);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "4px",
                    border: `1px solid ${theme?.colors?.text}40`,
                    backgroundColor: theme?.colors?.card,
                    color: theme?.colors?.text,
                    fontSize: "14px",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => fetchData(searchTerm, null)}
                  disabled={!searchTerm}
                >
                  Buscar
                </Button>
              </Box>

              {/* Lista de Sugestões */}
              {data?.sugestoesDespesas?.length > 0 && (
                <>
                  <Typography sx={{ color: theme?.colors?.text, mb: 2, fontSize: 14 }}>
                    Selecione uma despesa para ver a evolução mensal:
                  </Typography>
                  <Grid container spacing={1}>
                    {data.sugestoesDespesas.map((sugestao, idx) => (
                      <Grid item xs={12} md={6} key={idx}>
                        <Box
                          onClick={() => {
                            setSelectedFavorecido(sugestao);
                            fetchData("", sugestao.favorecido_id, sugestao.favorecido_nome);
                          }}
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            border: `1px solid ${theme?.colors?.text}20`,
                            backgroundColor: theme?.colors?.card,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: theme?.colors?.primary,
                              transform: "translateY(-2px)",
                              boxShadow: `0 4px 8px ${theme?.colors?.text}20`,
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 0.5 }}>
                                {sugestao.favorecido_nome}
                              </Typography>
                              <Box
                                sx={{
                                  display: "inline-block",
                                  px: 1,
                                  py: 0.3,
                                  borderRadius: 1,
                                  backgroundColor: `${getCategoryColor(sugestao.categoria)}30`,
                                  fontSize: 11,
                                }}
                              >
                                <Typography sx={{ color: getCategoryColor(sugestao.categoria), fontSize: 11, fontWeight: 600 }}>
                                  {getCategoryLabel(sugestao.categoria)}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                              <Typography sx={{ color: theme?.colors?.text, fontWeight: 600, fontSize: 14 }}>
                                {formatCurrency(sugestao.valor_total)}
                              </Typography>
                              <Typography sx={{ color: theme?.colors?.text, opacity: 0.7, fontSize: 12 }}>
                                {sugestao.total_transacoes} transações
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              {searchTerm && data?.sugestoesDespesas?.length === 0 && (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }}>
                    Nenhuma despesa encontrada com esse termo
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Resultado da despesa selecionada */}
          {selectedFavorecido && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, p: 2, borderRadius: 1, backgroundColor: theme?.colors?.card }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: theme?.colors?.text, fontSize: 12, opacity: 0.7 }}>
                    Comparando despesa:
                  </Typography>
                  <Typography sx={{ color: theme?.colors?.text, fontWeight: 600, fontSize: 18 }}>
                    {selectedFavorecido.favorecido_nome}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSelectedFavorecido(null);
                    setSearchTerm("");
                    fetchData("", null);
                  }}
                >
                  Alterar
                </Button>
              </Box>

              <Typography sx={{ color: theme?.colors?.text, mb: 2, fontSize: 14 }}>
                Evolução mensal de: <strong>"{selectedFavorecido.favorecido_nome}"</strong>
              </Typography>
              <TableContainer component={Paper} style={{ backgroundColor: "transparent" }}>
                <Table>
                  <TableHead>
                    <TableRow style={{ backgroundColor: theme?.colors?.body }}>
                      <TableCell style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                        Mês
                      </TableCell>
                      <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                        Quantidade
                      </TableCell>
                      <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                        Valor Médio
                      </TableCell>
                      <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                        Total
                      </TableCell>
                      <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                        Variação
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.transacaoPorMes.map((row, idx) => {
                      const variacaoPercentual =
                        idx < data.transacaoPorMes.length - 1
                          ? ((row.total - data?.transacaoPorMes[idx + 1]?.total) /
                              data?.transacaoPorMes[idx + 1]?.total) *
                            100
                          : 0;
                      const variacaoColor =
                        variacaoPercentual > 0
                          ? "#f44336"
                          : variacaoPercentual < 0
                          ? "#4caf50"
                          : theme?.colors?.text;

                      return (
                        <TableRow key={idx}>
                          <TableCell style={{ color: theme?.colors?.text }}>
                            {row.mes_formatado}
                          </TableCell>
                          <TableCell align="right" style={{ color: theme?.colors?.text }}>
                            {row.quantidade}x
                          </TableCell>
                          <TableCell align="right" style={{ color: theme?.colors?.text }}>
                            {formatCurrency(row.ticket_medio)}
                          </TableCell>
                          <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                            {formatCurrency(row.total)}
                          </TableCell>
                          <TableCell align="right" style={{ color: variacaoColor, fontWeight: 600 }}>
                            {idx < data.transacaoPorMes.length - 1
                              ? `${variacaoPercentual > 0 ? "+" : ""}${variacaoPercentual.toFixed(1)}%`
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {selectedFavorecido && data?.transacaoPorMes?.length === 0 && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography sx={{ color: theme?.colors?.text, opacity: 0.7 }}>
                Nenhuma transação encontrada para este favorecido no período selecionado
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Despesas por Categoria */}
      <Card style={{ backgroundColor: theme?.colors?.body }} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 2 }}>
            Despesas por Categoria
          </Typography>
          <Grid container spacing={2}>
            {data?.despesasPorCategoria?.map((cat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: `2px solid ${getCategoryColor(cat.categoria)}`,
                    backgroundColor: `${getCategoryColor(cat.categoria)}15`,
                  }}
                >
                  <Typography
                    sx={{
                      color: theme?.colors?.text,
                      fontSize: 14,
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {getCategoryLabel(cat.categoria)}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: theme?.colors?.text, fontWeight: 700, mb: 1 }}
                  >
                    {formatCurrency(cat.total)}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={cat.percentual}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme?.colors?.card,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getCategoryColor(cat.categoria),
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: theme?.colors?.text, opacity: 0.7, fontSize: 12 }}>
                      {cat.quantidade} transações
                    </Typography>
                    <Typography
                      sx={{
                        color: getCategoryColor(cat.categoria),
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {cat.percentual}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Evolução Mensal */}
      <Card style={{ backgroundColor: theme?.colors?.body }} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 2 }}>
            Evolução Mensal de Despesas
          </Typography>
          <TableContainer component={Paper} style={{ backgroundColor: "transparent" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: theme?.colors?.body }}>
                  <TableCell style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Mês
                  </TableCell>
                  <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Transações
                  </TableCell>
                  <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Ticket Médio
                  </TableCell>
                  <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Total
                  </TableCell>
                  <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Variação
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.evolucaoMensal?.map((row, idx) => {
                  const variacaoPercentual =
                    idx < data.evolucaoMensal.length - 1
                      ? ((row.total - data?.evolucaoMensal[idx + 1]?.total) /
                          data?.evolucaoMensal[idx + 1]?.total) *
                        100
                      : 0;
                  const variacaoColor =
                    variacaoPercentual > 0
                      ? "#f44336"
                      : variacaoPercentual < 0
                      ? "#4caf50"
                      : theme?.colors?.text;

                  return (
                    <TableRow key={idx}>
                      <TableCell style={{ color: theme?.colors?.text }}>
                        {row.mes_formatado}
                      </TableCell>
                      <TableCell align="right" style={{ color: theme?.colors?.text }}>
                        {row.quantidade}
                      </TableCell>
                      <TableCell align="right" style={{ color: theme?.colors?.text }}>
                        {formatCurrency(row.ticket_medio)}
                      </TableCell>
                      <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                        {formatCurrency(row.total)}
                      </TableCell>
                      <TableCell align="right" style={{ color: variacaoColor, fontWeight: 600 }}>
                        {idx < data.evolucaoMensal.length - 1
                          ? `${variacaoPercentual > 0 ? "+" : ""}${variacaoPercentual.toFixed(1)}%`
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Evolução Mensal por Categoria */}
      <Card style={{ backgroundColor: theme?.colors?.body }} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 2 }}>
            Evolução por Categoria
          </Typography>
          {data?.evolucaoMensalCategoria?.map((mes, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography
                sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 1, fontSize: 14 }}
              >
                {mes.mes_formatado}
              </Typography>
              <Grid container spacing={1}>
                {mes.categorias.map((cat, catIdx) => {
                  const totalMes = mes.categorias.reduce((sum, c) => sum + parseFloat(c.total), 0);
                  const percentual = ((cat.total / totalMes) * 100).toFixed(1);

                  return (
                    <Grid item xs={12} sm={6} md={3} key={catIdx}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: `${getCategoryColor(cat.categoria)}20`,
                          borderLeft: `4px solid ${getCategoryColor(cat.categoria)}`,
                        }}
                      >
                        <Typography sx={{ color: theme?.colors?.text, fontSize: 12, mb: 0.5 }}>
                          {getCategoryLabel(cat.categoria)}
                        </Typography>
                        <Typography
                          sx={{
                            color: theme?.colors?.text,
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          {formatCurrency(cat.total)}
                        </Typography>
                        <Typography
                          sx={{
                            color: getCategoryColor(cat.categoria),
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {percentual}% • {cat.quantidade} transações
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
              {idx < (data?.evolucaoMensalCategoria?.length || 0) - 1 && (
                <Divider sx={{ mt: 2, borderColor: theme?.colors?.text, opacity: 0.1 }} />
              )}
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Top Favorecidos */}
      <Card style={{ backgroundColor: theme?.colors?.body }} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 2 }}>
            Top 20 Maiores Despesas por Favorecido
          </Typography>
          <TableContainer component={Paper} style={{ backgroundColor: "transparent" }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: theme?.colors?.body }}>
                  <TableCell style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Favorecido
                  </TableCell>
                  <TableCell style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Categoria
                  </TableCell>
                  <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Transações
                  </TableCell>
                  <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Ticket Médio
                  </TableCell>
                  <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Total
                  </TableCell>
                  <TableCell align="center" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                    Período
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.topFavorecidos?.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                      {row.favorecido_nome}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: `${getCategoryColor(row.categoria)}30`,
                          color: getCategoryColor(row.categoria),
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {getCategoryLabel(row.categoria)}
                      </Box>
                    </TableCell>
                    <TableCell align="right" style={{ color: theme?.colors?.text }}>
                      {row.quantidade}
                    </TableCell>
                    <TableCell align="right" style={{ color: theme?.colors?.text }}>
                      {formatCurrency(row.ticket_medio)}
                    </TableCell>
                    <TableCell align="right" style={{ color: theme?.colors?.text, fontWeight: 600 }}>
                      {formatCurrency(row.total)}
                    </TableCell>
                    <TableCell align="center" style={{ color: theme?.colors?.text, fontSize: 12 }}>
                      {moment(row.primeira_transacao).format("DD/MM/YY")} -{" "}
                      {moment(row.ultima_transacao).format("DD/MM/YY")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Despesas por Situação */}
      <Card style={{ backgroundColor: theme?.colors?.body }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme?.colors?.text, fontWeight: 600, mb: 2 }}>
            Despesas por Situação
          </Typography>
          <Grid container spacing={2}>
            {data?.despesasPorSituacao?.map((sit, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    backgroundColor: theme?.colors?.card,
                  }}
                >
                  <Typography
                    sx={{
                      color: theme?.colors?.text,
                      fontSize: 14,
                      textTransform: "capitalize",
                      mb: 1,
                    }}
                  >
                    {sit.situacao}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: theme?.colors?.text, fontWeight: 700, mb: 1 }}
                  >
                    {formatCurrency(sit.total)}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: theme?.colors?.text, opacity: 0.7, fontSize: 12 }}>
                      {sit.quantidade} transações
                    </Typography>
                    <Typography sx={{ color: theme?.colors?.primary, fontWeight: 600, fontSize: 12 }}>
                      {sit.percentual}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Modal de Seleção de Data */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={false}
        maxWidth="lg"
      >
        <DialogTitle style={{ backgroundColor: theme?.colors?.body }}>
          <Typography sx={{ color: theme?.colors?.text }}>
            Selecione o período
          </Typography>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: theme?.colors?.body }}>
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleSelect}
            locale={locales.pt}
            dateDisplayFormat="dd/MM/yyyy"
            staticRanges={defaultStaticRanges}
            inputRanges={defaultInputRanges}
          />
        </DialogContent>
        <DialogActions style={{ backgroundColor: theme?.colors?.body }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={fetchData} variant="contained">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AnaliseDespesas;

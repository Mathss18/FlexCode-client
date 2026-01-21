import { Box, Grid, Typography, Divider } from "@mui/material";
import { useHistory } from "react-router-dom";
import CardRelatorio from "../../components/relatorios/CardRelatorio";
import { useTheme } from "../../theme/useTheme";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";

function ListarRelatorios() {
  const history = useHistory();
  const { theme } = useTheme();

  const categories = [
    {
      title: "Análises Estratégicas",
      icon: <AssessmentIcon sx={{ fontSize: 28, color: theme?.colors?.primary }} />,
      description: "Relatórios analíticos para tomada de decisões",
      reports: [
        { title: "Análise de Clientes", path: "/relatorios/analise-clientes" },
        { title: "Análise de Produtos", path: "/relatorios/analise-produtos" },
        { title: "Análise Financeira", path: "/relatorios/analise-financeira" },
        { title: "Análise Operacional", path: "/relatorios/analise-operacional" },
        { title: "Análise de Fornecedores", path: "/relatorios/analise-fornecedores" },
        { title: "Pra onde vai meu dinheiro", path: "/relatorios/analise-despesas" },
      ],
    },
    {
      title: "Financeiro",
      icon: <TrendingUpIcon sx={{ fontSize: 28, color: theme?.colors?.primary }} />,
      description: "Controle e análise financeira",
      reports: [
        { title: "Rendimentos vs Despesas", path: "/relatorios/rendimentosVsDespesas" },
        { title: "Patrimônio ao longo do tempo", path: "/relatorios/patrimonioAoLongoDoTempo" },
        { title: "Previsão de Saldo", path: "/relatorios/previsaoDeSaldo" },
        { title: "Detalhes de Pagamento", path: "/relatorios/detalhesDePagamento" },
        { title: "Faturamento", path: "/relatorios/faturamento" },
        { title: "Imposto", path: "/relatorios/imposto" },
      ],
    },
    {
      title: "Vendas",
      icon: <ReceiptIcon sx={{ fontSize: 28, color: theme?.colors?.primary }} />,
      description: "Acompanhamento de vendas e desempenho",
      reports: [
        { title: "Vendas por período", path: "/relatorios/vendas" },
        { title: "Vendas ao longo do tempo", path: "/relatorios/vendasAoLongoDoTempo" },
        { title: "Performance", path: "/relatorios/performance" },
      ],
    },
    {
      title: "Estoque e Produtos",
      icon: <InventoryIcon sx={{ fontSize: 28, color: theme?.colors?.primary }} />,
      description: "Gestão de estoque e precificação",
      reports: [
        { title: "Estoque", path: "/relatorios/estoque" },
        { title: "Reajuste de Preços", path: "/relatorios/reajusteDePrecos" },
      ],
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600, 
            color: theme?.colors?.text,
            mb: 1 
          }}
        >
          Relatórios Gerenciais
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme?.colors?.text, 
            opacity: 0.7 
          }}
        >
          Acesse os relatórios organizados por categoria
        </Typography>
      </Box>

      {categories.map((category, index) => (
        <Box key={index} sx={{ mb: 5 }}>
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 2, 
              mb: 2 
            }}
          >
            {category.icon}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme?.colors?.text 
                }}
              >
                {category.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme?.colors?.text, 
                  opacity: 0.6 
                }}
              >
                {category.description}
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            {category.reports.map((report, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <CardRelatorio 
                  title={report.title} 
                  click={() => history.push(report.path)} 
                />
              </Grid>
            ))}
          </Grid>
          
          {index < categories.length - 1 && (
            <Divider sx={{ mt: 4, borderColor: theme?.colors?.text, opacity: 0.1 }} />
          )}
        </Box>
      ))}
    </Box>
  );
}

export default ListarRelatorios;

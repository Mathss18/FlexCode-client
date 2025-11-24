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
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Collapse, IconButton } from "@mui/material";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import { useTheme } from "../../theme/useTheme";
import moment from 'moment';
import api from "../../services/api";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row({ row, theme }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        sx={{ 
          '& > *': { borderBottom: 'unset' },
          cursor: 'pointer',
          backgroundColor: theme.colors.body,
          color: theme.colors.text,
          '&:hover': { backgroundColor: theme.colors.hover || 'rgba(255, 255, 255, 0.08)' }
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell sx={{ color: theme.colors.text }}>
          <IconButton
            aria-label="expand row"
            size="small"
            sx={{ color: theme.colors.text }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: theme.colors.text }}>
          {row.mes_ano}
        </TableCell>
        <TableCell align="right" sx={{ color: theme.colors.text }}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.total)}
        </TableCell>
        <TableCell align="right" sx={{ color: theme.colors.text }}>{row.quantidade_notas}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: theme.colors.body }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, backgroundColor: theme.colors.body }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ color: theme.colors.text }}>
                Notas Fiscais
              </Typography>
              <Table size="small" aria-label="notas">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.colors.body }}>
                    <TableCell sx={{ color: theme.colors.text }}>Número</TableCell>
                    <TableCell sx={{ color: theme.colors.text }}>Favorecido</TableCell>
                    <TableCell sx={{ color: theme.colors.text }}>Chave</TableCell>
                    <TableCell align="right" sx={{ color: theme.colors.text }}>Valor</TableCell>
                    <TableCell sx={{ color: theme.colors.text }}>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.notas.map((nota) => (
                    <TableRow key={nota.chave} sx={{ backgroundColor: theme.colors.body }}>
                      <TableCell component="th" scope="row" sx={{ color: theme.colors.text }}>
                        {nota.numero}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text }}>{nota.favorecido || '-'}</TableCell>
                      <TableCell sx={{ color: theme.colors.text }}>{nota.chave}</TableCell>
                      <TableCell align="right" sx={{ color: theme.colors.text }}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nota.valor)}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text }}>{nota.data}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function Faturamento() {
  const fullScreenLoader = useFullScreenLoader();
  const { theme } = useTheme();
  const [dados, setDados] = useState(null);
  const [open, setOpen] = useState(false);
  
  // Calcular os últimos 12 meses
  const getDefaultDateRange = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    // Data início: primeiro dia do mês há 12 meses atrás
    const dataInicio = new Date(anoAtual, mesAtual - 11, 1);
    
    // Data fim: último dia do mês atual
    const dataFim = new Date(anoAtual, mesAtual + 1, 0);
    
    return { startDate: dataInicio, endDate: dataFim };
  };
  
  const [state, setState] = useState([
    {
      ...getDefaultDateRange(),
      key: "selection",
    },
  ]);
  
  function handleClose() {
    setOpen(false);
  }

  const carregarDados = () => {
    fullScreenLoader.setLoading(true);
    api
      .get(
        `/relatorios/faturamento?startDate=${moment(
          state[0].startDate
        ).format("YYYY-MM-DD")}&endDate=${moment(state[0].endDate).format(
          "YYYY-MM-DD"
        )}`
      )
      .then((response) => {
        console.log(response.data.data);
        setDados(response.data.data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  };

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={() => {
              handleClose();
              carregarDados();
            }}
            variant="contained"
          >
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mb: 3 }}>
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
      </Box>

      {dados && (
        <Paper sx={{ backgroundColor: theme.colors.body }}>
          <Box sx={{ p: 2, backgroundColor: theme.colors.body }}>
            <Typography variant="h5" gutterBottom sx={{ color: theme.colors.text }}>
              Relatório de Faturamento - {dados.empresa}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, mb: 2, color: theme.colors.primary || '#1976d2' }}>
              Total Geral: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(dados.total_geral) || 0)}
            </Typography>
          </Box>
          
          <TableContainer sx={{ backgroundColor: theme.colors.body }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.colors.body }}>
                  <TableCell sx={{ color: theme.colors.text }} />
                  <TableCell sx={{ color: theme.colors.text }}>Mês/Ano</TableCell>
                  <TableCell align="right" sx={{ color: theme.colors.text }}>Total</TableCell>
                  <TableCell align="right" sx={{ color: theme.colors.text }}>Quantidade de Notas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.vendas_por_mes.map((row) => (
                  <Row key={row.mes_ano} row={row} theme={theme} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
}

export default Faturamento;

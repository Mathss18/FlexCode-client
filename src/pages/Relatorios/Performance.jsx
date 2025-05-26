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
import { Button } from "@mui/material";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import moment from "moment";
import api from "../../services/api";
import { objectToArray } from "../../utils/functions";
import MUIDataTable from "mui-datatables";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { config } from "../../config/tablesConfig";

function Performance() {
  const fullScreenLoader = useFullScreenLoader();
  const [dados, setDados] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [state, setState] = useState([
    {
      startDate: addDays(new Date(), -7), // Uma semana atrás
      endDate: new Date(), // Hoje
      key: "selection",
    },
  ]);

  function handleClose() {
    setOpen(false);
  }

  const columns = [
    {
      name: "Nome",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Total Produtos",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Total OF",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "Ações",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <Button
              variant="outlined"
              size="small"
              onClick={() =>
                setSelectedFuncionario(
                  dados.funcionarios_performance[tableMeta.rowIndex]
                )
              }
            >
              Ver Detalhes
            </Button>
          );
        },
      },
    },
  ];

  const tableData =
    dados?.funcionarios_performance?.map((f) => [
      f.funcionario.nome,
      f.total_produtos_trabalhados,
      f.total_ordens_servico,
      null, // Para a coluna de ações
    ]) || [];

  useEffect(() => {
    if (open) return;

    fullScreenLoader.setLoading(true);
    api
      .get(
        `/relatorios/performance?startDate=${moment(state[0].startDate).format(
          "YYYY-MM-DD"
        )}&endDate=${moment(state[0].endDate).format("YYYY-MM-DD")}`
      )
      .then((response) => {
        console.log(objectToArray(response.data["data"]));
        setDados(response.data["data"]);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, state]);

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
      </Button>{" "}
      {/* Relatório de Performance */}
      {dados && (
        <div style={{ marginTop: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <Typography variant="h4">Relatório de Performance</Typography>{" "}
            <Typography variant="body1">
              <strong>Período:</strong>{" "}
              {moment(dados.periodo?.data_inicio).format("DD/MM/YYYY")} até{" "}
              {moment(dados.periodo?.data_fim).format("DD/MM/YYYY")}
            </Typography>
            <Typography variant="body1">
              <strong>Total de Funcionários:</strong> {dados.total_funcionarios}
            </Typography>
            <Typography variant="body1">
              <strong>Total de Logs:</strong> {dados.total_logs}
            </Typography>
          </div>

          <MUIDataTable
            title={"Performance dos Funcionários"}
            data={tableData}
            columns={columns}
            options={config}
            className={"table-background"}
          />
        </div>
      )}
      {/* Modal de Detalhes do Funcionário */}
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={!!selectedFuncionario}
        onClose={() => setSelectedFuncionario(null)}
      >
        <DialogTitle>
          Detalhes de Performance - {selectedFuncionario?.funcionario?.nome}
        </DialogTitle>
        <DialogContent>
          {selectedFuncionario && (
            <div>
              <Typography variant="h6" gutterBottom>
                Ordens de Serviço ({selectedFuncionario.total_ordens_servico})
              </Typography>
              {selectedFuncionario.ordens_servico?.map((os, index) => (
                <Accordion
                  key={index}
                  style={{
                    marginBottom: 8,
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px 8px 0 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography style={{ flex: 1 }}>
                        <strong>OF #{os.ordem_servico.numero}</strong> -{" "}
                        {os.ordem_servico.cliente.nome}
                      </Typography>
                      <Chip
                        className="table-tag"
                        label={`${os.total_produtos} Produto${
                          os.total_produtos > 1 ? "s" : ""
                        }`}
                        size="small"
                        color="primary"
                        style={{ marginLeft: 8 }}
                      />
                    </div>
                  </AccordionSummary>
                  <AccordionDetails style={{ backgroundColor: "#fafafa" }}>
                    <div style={{ width: "100%" }}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        color="primary"
                      >
                        Produtos trabalhados:
                      </Typography>
                      {os.produtos?.map((produto, prodIndex) => (
                        <Card
                          key={prodIndex}
                          style={{
                            marginBottom: 8,
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          <CardContent style={{ padding: "12px !important" }}>
                            <Typography
                              variant="body2"
                              style={{ fontWeight: "bold", color: "#1976d2" }}
                            >
                              {produto.nome}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              📅 Marcado em: {produto.data_marcacao}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}

              <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
                Produtos por Data
              </Typography>
              {Object.entries(selectedFuncionario.produtos_por_data || {}).map(
                ([data, produtos]) => (
                  <Accordion
                    key={data}
                    style={{
                      marginBottom: 8,
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Typography style={{ flex: 1 }}>
                          <strong>📅 {data}</strong>
                        </Typography>
                        <Chip
                          label={`${produtos.length} Produto${
                            produtos.length > 1 ? "s" : ""
                          }`}
                          size="small"
                          color="primary"
                          style={{ marginLeft: 8 }}
                        />
                      </div>
                    </AccordionSummary>
                    <AccordionDetails style={{ backgroundColor: "#f8f9fa" }}>
                      <div style={{ width: "100%" }}>
                        {produtos.map((item, prodIndex) => (
                          <Card
                            key={prodIndex}
                            style={{
                              marginBottom: 8,
                              backgroundColor: "#fff",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                          >
                            <CardContent style={{ padding: "12px !important" }}>
                              <Typography
                                variant="body2"
                                style={{ fontWeight: "bold", color: "#1976d2" }}
                              >
                                {item.produto.nome}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                🏭 OF #{item.ordem_servico.numero} - ⏰{" "}
                                {item.hora_marcacao}
                              </Typography>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFuncionario(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Performance;

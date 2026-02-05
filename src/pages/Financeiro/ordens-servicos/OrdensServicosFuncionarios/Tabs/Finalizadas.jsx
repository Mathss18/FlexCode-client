import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import api from "../../../../../services/api";
import { config, rowConfig } from "../../../../../config/tablesConfig";
import { useRefreshTarefas } from "../../../../../context/RefreshTarefasContext";
import CheckIcon from "@mui/icons-material/Check";
import moment from "moment";
import FullScreenDialog from "../../../../../components/dialog/FullScreenDialog";
import {
  AppBar,
  Avatar,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import PhotoIcon from "@mui/icons-material/Photo";
import BuildIcon from "@mui/icons-material/Build";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useFullScreenLoader } from "../../../../../context/FullScreenLoaderContext";
import ModalFotoProduto from "./ModalFotoProduto";

export function Finalizadas() {
  const { idUsuario } = useParams();
  const { refreshTrigger } = useRefreshTarefas();
  const [openFotoModal, setOpenFotoModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [ordensServicosFuncionarios, setOrdensServicosFuncionarios] = useState(
    []
  );
  const fullScreenLoader = useFullScreenLoader();
  const [open, setOpen] = useState(false);
  const [dados, setDados] = useState({});
  const columns = [
    {
      name: "N° Ordem de Servico",
      options: rowConfig,
    },
    {
      name: "Cliente",
      options: rowConfig,
    },
    {
      name: "Data Abertura",
      options: rowConfig,
    },
    {
      name: "Data Entrega",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, element) {
    console.log(element);
    setDados(element);
    setOpen(true);
  }

  function search() {
    api
      .get("/minhas-tarefas/" + idUsuario + "/finalizadas")
      .then((response) => {
        response.data["data"].forEach((element) => {
          var array = [
            element["ordem_servico"].numero,
            element["ordem_servico"].cliente.nome,
            moment(element["ordem_servico"].dataEntrada).format("DD/MM/YYYY") +
              " " +
              element["ordem_servico"].horaEntrada,
            moment(element["ordem_servico"].dataSaida).format("DD/MM/YYYY") +
              " " +
              element["ordem_servico"].horaSaida,
            <>
              <MoreHorizIcon
                className={"btn btn-lista"}
                onClick={(event) => {
                  handleOnClickShowButton(event, element);
                }}
              />
            </>,
          ];
          data.push(array);
        });
        setOrdensServicosFuncionarios(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    search();
  }, [refreshTrigger]);

  function isProdutoMarked(element) {
    var jsonAntigo = JSON.parse(element.pivot.situacao);
    if (jsonAntigo == null) {
      return false;
    }
    const existe = jsonAntigo.find(
      (element) => element.usuario_id === idUsuario
    );
    if (!!existe && existe.situacao) {
      return true;
    }
    return false;
  }

  function isServicoMarked(element) {
    var jsonAntigo = JSON.parse(element.pivot.situacao);
    if (jsonAntigo == null) {
      return false;
    }
    const existe = jsonAntigo.find(
      (element) => element.usuario_id === idUsuario
    );
    if (!!existe && existe.situacao) {
      return true;
    }
    return false;
  }

  const DialogHeader = () => {
    const produtos = dados["ordem_servico"]?.produtos || [];
    const servicos = dados["ordem_servico"]?.servicos || [];
    const totalItems = produtos.length + servicos.length;
    const produtosMarcados = produtos.filter((p) => isProdutoMarked(p)).length;
    const servicosMarcados = servicos.filter((s) => isServicoMarked(s)).length;
    const totalMarcados = produtosMarcados + servicosMarcados;
    const progresso = totalItems > 0 ? Math.round((totalMarcados / totalItems) * 100) : 0;

    return (
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="h6" component="div" className="cardText">
              {`Ordem de serviço N° ${dados["ordem_servico"]?.numero || ""}`}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}>
              <Typography variant="body2">
                Cliente: {dados["ordem_servico"]?.cliente?.nome || ""}
              </Typography>
              <Chip
                label={`${totalMarcados}/${totalItems} itens`}
                size="small"
                sx={{
                  bgcolor: progresso === 100 ? "success.light" : "info.light",
                  color: "white",
                  fontWeight: 600,
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {progresso}% completo
              </Typography>
            </Box>
          </Box>
          <Button
            autoFocus
            color="inherit"
            onClick={() => setOpen(false)}
            sx={{
              fontWeight: 600,
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            Fechar
          </Button>
        </Toolbar>
      </AppBar>
    );
  };

  const DialogBody = () => {
    return (
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 3 },
          minHeight: "60vh",
          width: "100%",
        }}
        className="cardBackground"
      >
        {/* Seção de Produtos */}
        {dados["ordem_servico"]?.produtos?.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
                pb: 2,
                borderBottom: 2,
                borderColor: "primary.main",
              }}
            >
              <BubbleChartIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
                className="cardText"
              >
                Produtos
              </Typography>
              <Chip
                label={`${dados["ordem_servico"]?.produtos?.filter((p) => isProdutoMarked(p)).length}/${dados["ordem_servico"]?.produtos?.length}`}
                size="small"
                color="primary"
                sx={{ ml: 1, fontWeight: 600 }}
              />
            </Box>
            <Grid container spacing={3}>
              {[...dados["ordem_servico"]?.produtos].sort((a, b) => a.nome.localeCompare(b.nome)).map((element, index) => {
                const isMarked = isProdutoMarked(element);
                return (
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={3} key={index}>
                    <Card
                      elevation={isMarked ? 4 : 1}
                      className="cardBackground"
                      sx={{
                        height: "100%",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        border: 2,
                        borderColor: isMarked ? "success.main" : "error.main",
                        position: "relative",
                        overflow: "visible",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: 8,
                          borderColor: isMarked ? "success.dark" : "error.dark",
                        },
                        "&::before": isMarked
                          ? {
                              content: '""',
                              position: "absolute",
                              top: -2,
                              right: -2,
                              width: 24,
                              height: 24,
                              bgcolor: "success.main",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 1,
                            }
                          : {},
                      }}
                      onClick={() => {
                        setProdutoSelecionado(element);
                        setOpenFotoModal(true);
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          {/* Ícone de status (apenas visual) */}
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: isMarked ? "success.main" : "error.main",
                              color: "white",
                              boxShadow: 2,
                              flexShrink: 0,
                            }}
                          >
                            {isMarked ? <CheckIcon /> : <CloseIcon />}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              className="cardText"
                              sx={{
                                mb: 1.5,
                                fontSize: { xs: "1rem", sm: "1.1rem" },
                                lineHeight: 1.3,
                              }}
                            >
                              {element.nome}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                className="cardText"
                                sx={{
                                  width: "fit-content",
                                  fontWeight: 700,
                                  fontSize: "1rem",
                                }}
                              >
                                {`Código: ${element.codigoInterno}`}
                              </Typography>
                              <Chip
                                label={`Quantidade: ${element.pivot.quantidade}`}
                                size="small"
                                color="primary"
                                sx={{
                                  width: "fit-content",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            {element.pivot.observacao && (
                              <Box
                                sx={{
                                  mt: 2,
                                  p: 1.5,
                                  bgcolor: "action.hover",
                                  borderRadius: 1,
                                  borderLeft: 3,
                                  borderColor: "warning.main",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontStyle: "italic",
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  <strong>Obs:</strong> {element.pivot.observacao}
                                </Typography>
                              </Box>
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 2,
                                pt: 1.5,
                                borderTop: 1,
                                borderColor: "divider",
                              }}
                            >
                              <PhotoIcon
                                sx={{ fontSize: 18, color: "primary.main" }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "primary.main",
                                  fontWeight: 500,
                                  fontSize: "0.875rem",
                                }}
                              >
                                Clique para ver fotos
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Seção de Serviços */}
        {dados["ordem_servico"]?.servicos?.length > 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
                pb: 2,
                borderBottom: 2,
                borderColor: "primary.main",
              }}
            >
              <BuildIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
                className="cardText"
              >
                Serviços
              </Typography>
              <Chip
                label={`${dados["ordem_servico"]?.servicos?.filter((s) => isServicoMarked(s)).length}/${dados["ordem_servico"]?.servicos?.length}`}
                size="small"
                color="primary"
                sx={{ ml: 1, fontWeight: 600 }}
              />
            </Box>
            <Grid container spacing={3}>
              {[...dados["ordem_servico"]?.servicos].sort((a, b) => a.nome.localeCompare(b.nome)).map((element, index) => {
                const isMarked = isServicoMarked(element);
                return (
                  <Grid item xs={12} sm={6} md={3} lg={3} xl={2} key={index}>
                    <Card
                      elevation={isMarked ? 4 : 1}
                      className="cardBackground"
                      sx={{
                        height: "100%",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: 2,
                        borderColor: isMarked ? "success.main" : "error.main",
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: 8,
                          borderColor: isMarked ? "success.dark" : "error.dark",
                        },
                        "&::before": isMarked
                          ? {
                              content: '""',
                              position: "absolute",
                              top: -2,
                              right: -2,
                              width: 24,
                              height: 24,
                              bgcolor: "success.main",
                              borderRadius: "50%",
                              zIndex: 1,
                            }
                          : {},
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          {/* Ícone de status (apenas visual) */}
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: isMarked ? "success.main" : "error.main",
                              color: "white",
                              boxShadow: 2,
                              flexShrink: 0,
                            }}
                          >
                            {isMarked ? <CheckIcon /> : <CloseIcon />}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              className="cardText"
                              sx={{
                                fontWeight: 700,
                                mb: 1.5,
                                fontSize: { xs: "1rem", sm: "1.1rem" },
                                lineHeight: 1.3,
                              }}
                            >
                              {element.nome}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              <Chip
                                label={`Código: ${element.codigoInterno}`}
                                size="medium"
                                variant="outlined"
                                color="primary"
                                sx={{
                                  width: "fit-content",
                                  fontWeight: 700,
                                  fontSize: "0.875rem",
                                }}
                              />
                              <Chip
                                label={`Quantidade: ${element.pivot.quantidade}`}
                                size="small"
                                color="primary"
                                sx={{
                                  width: "fit-content",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            {element.pivot.observacao && (
                              <Box
                                sx={{
                                  mt: 2,
                                  p: 1.5,
                                  bgcolor: "action.hover",
                                  borderRadius: 1,
                                  borderLeft: 3,
                                  borderColor: "warning.main",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontStyle: "italic",
                                    color: "text.secondary",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  <strong>Obs:</strong> {element.pivot.observacao}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Mensagem quando não há items */}
        {!dados["ordem_servico"]?.produtos?.length &&
          !dados["ordem_servico"]?.servicos?.length && (
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <BubbleChartIcon sx={{ fontSize: 64, color: "text.disabled" }} />
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Nenhum item encontrado nesta ordem de serviço
              </Typography>
            </Box>
          )}
      </Box>
    );
  };

  const DialogFooter = () => {
    return (
      <>
        {dados?.observacao && (
          <Box sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Observações:
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {dados?.observacao}
            </Typography>
          </Box>
        )}
      </>
    );
  };

  return (
    <>
      <ModalFotoProduto
        open={openFotoModal}
        setOpen={setOpenFotoModal}
        item={produtoSelecionado}
      />
      <FullScreenDialog
        open={open}
        setOpen={setOpen}
        Header={DialogHeader}
        Body={DialogBody}
        Footer={DialogFooter}
      />

      <MUIDataTable
        title={"Minhas Ordens de Serviços - Finalizadas"}
        data={ordensServicosFuncionarios}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

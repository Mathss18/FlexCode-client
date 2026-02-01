import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../../../config/tablesConfig";
import { useFullScreenLoader } from "../../../../../context/FullScreenLoaderContext";
import { useRefreshTarefas } from "../../../../../context/RefreshTarefasContext";
import CheckIcon from "@mui/icons-material/Check";
import BuildIcon from "@mui/icons-material/Build";
import PhotoIcon from "@mui/icons-material/Photo";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import moment from "moment";
import FullScreenDialog from "../../../../../components/dialog/FullScreenDialog";
import {
  AppBar,
  Avatar,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  confirmAlert,
  errorAlert,
  textAreaAlert,
} from "../../../../../utils/alert";
import api from "../../../../../services/api";
import ModalFotoProduto from "./ModalFotoProduto";
import toast from "react-hot-toast";

export function EmAndamento() {
  const { idUsuario } = useParams();
  const { triggerRefresh } = useRefreshTarefas();
  const [openFotoModal, setOpenFotoModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [ordensServicosFuncionarios, setOrdensServicosFuncionarios] = useState(
    [],
  );
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const fullScreenLoader = useFullScreenLoader();
  const [open, setOpen] = useState(false);
  const [dados, setDados] = useState({});
  const [loadingProdutoIds, setLoadingProdutoIds] = useState([]);
  const [loadingServicoIds, setLoadingServicoIds] = useState([]);

  const columns = [
    {
      name: "N° Ordem de Serviço",
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
      name: "Status",
      options: rowConfig,
    },
    {
      name: "Iniciado",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, element) {
    setDados(element);
    setOpen(true);
  }

  function handleOnClickEditButton(event, element) {
    confirmAlert(
      "Deseja finalizar essa tarefa?",
      "Após finalizar, não será possível desfazer essa ação",
      () => moveToFinalizadas(element),
    );
  }

  function moveToFinalizadas(element) {
    textAreaAlert().then((response) => {
      fullScreenLoader.setLoading(true);
      api
        .put("/minhas-tarefas/" + element.id, {
          ...element,
          status: 2,
          observacao: response,
          dataFinalizado: moment().format("YYYY-MM-DD"),
        })
        .then(() => {
          setOpen(false);
          search();
          triggerRefresh();
          toast.success("Tarefa finalizada com sucesso!");
        })
        .catch((error) => {
          errorAlert("Atenção", error?.response?.data?.message);
        })
        .finally(() => {
          fullScreenLoader.setLoading(false);
        });
    });
  }

  function finalizarAutomaticamente(element) {
    fullScreenLoader.setLoading(true);
    api
      .put("/minhas-tarefas/" + element.id, {
        ...element,
        status: 2,
        observacao:
          "Finalizado automaticamente - todos os itens foram concluídos",
        dataFinalizado: moment().format("YYYY-MM-DD"),
      })
      .then(() => {
        setOpen(false);
        search();
        triggerRefresh();
        toast.success(
          "OF finalizada automaticamente! Todos os itens foram concluídos.",
        );
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  function search() {
    fullScreenLoader.setLoading(true);
    api
      .get("/minhas-tarefas/" + idUsuario + "/fazendo")
      .then((response) => {
        const newData = [];
        response.data["data"].forEach((element) => {
          const now = moment();
          const dataSaida = moment(
            element["ordem_servico"].dataSaida,
            "YYYY-MM-DD",
          );
          const diff = now.diff(dataSaida, "days");

          let chipLabel = "Em dia";
          let chipColor = "#4caf50";

          if (diff === 1) {
            chipColor = "#ec8232";
            chipLabel = `${diff} dia de atraso`;
          } else if (diff > 2) {
            chipColor = "#c55959";
            chipLabel = `${diff} dias de atraso`;
          }

          const isStarted = element.status === 1;

          newData.push([
            element["ordem_servico"].numero,
            element["ordem_servico"].cliente.nome,
            moment(element["ordem_servico"].dataEntrada).format("DD/MM/YYYY") +
              " " +
              element["ordem_servico"].horaEntrada,
            moment(element["ordem_servico"].dataSaida).format("DD/MM/YYYY") +
              " " +
              element["ordem_servico"].horaSaida,

            <Chip
              key={`sit-${element.id}`}
              className="table-tag"
              label={chipLabel}
              size="small"
              style={{
                width: "110px",
                backgroundColor: chipColor,
                color: "#fff",
              }}
            />,

            <Chip
              key={`init-${element.id}`}
              className="table-tag"
              label={isStarted ? "Iniciado" : "Não Iniciado"}
              size="small"
              style={{
                width: "120px",
                backgroundColor: isStarted ? "#4caf50" : "#ff9800",
                color: "#fff",
              }}
            />,

            <>
              <Tooltip title="Ver detalhes">
                <MoreHorizIcon
                  className="btn btn-lista"
                  onClick={(event) => {
                    handleOnClickShowButton(event, element);
                  }}
                />
              </Tooltip>
            </>,
          ]);
        });
        setOrdensServicosFuncionarios(newData);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  // Monitora mudanças na lista de tarefas e fecha o modal se ficar vazio
  useEffect(() => {
    if (ordensServicosFuncionarios.length === 0 && open) {
      setOpen(false);
    }
  }, [ordensServicosFuncionarios, open]);

  function searchSituacao(id, tipo) {
    if (tipo === "produto") {
      fullScreenLoader.setLoading(true);
      return api.get("/minhas-tarefas/getSituacao/" + id);
    }
    if (tipo === "servico") {
      fullScreenLoader.setLoading(true);
      return api.get("/minhas-tarefas/getServico/" + id);
    }
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line
  }, []);

  // Função para verificar se todos os itens estão marcados (recebe dados como parâmetro)
  function todosItensMarcados(dadosVerificar = dados) {
    const produtos = dadosVerificar["ordem_servico"]?.produtos || [];
    const servicos = dadosVerificar["ordem_servico"]?.servicos || [];

    if (produtos.length === 0 && servicos.length === 0) {
      return false;
    }

    const todosProdutosMarcados = produtos.every((produto) => {
      const jsonAntigo = JSON.parse(produto.pivot.situacao);
      if (!jsonAntigo) return false;
      const existe = jsonAntigo.find((el) => el.usuario_id === idUsuario);
      return existe && existe.situacao;
    });

    const todosServicosMarcados = servicos.every((servico) => {
      const jsonAntigo = JSON.parse(servico.pivot.situacao);
      if (!jsonAntigo) return false;
      const existe = jsonAntigo.find((el) => el.usuario_id === idUsuario);
      return existe && existe.situacao;
    });

    return todosProdutosMarcados && todosServicosMarcados;
  }

  // Função para verificar se pelo menos um item está marcado (recebe dados como parâmetro)
  function algumItemMarcado(dadosVerificar = dados) {
    const produtos = dadosVerificar["ordem_servico"]?.produtos || [];
    const servicos = dadosVerificar["ordem_servico"]?.servicos || [];

    const algumProdutoMarcado = produtos.some((produto) => {
      const jsonAntigo = JSON.parse(produto.pivot.situacao);
      if (!jsonAntigo) return false;
      const existe = jsonAntigo.find((el) => el.usuario_id === idUsuario);
      return existe && existe.situacao;
    });

    const algumServicoMarcado = servicos.some((servico) => {
      const jsonAntigo = JSON.parse(servico.pivot.situacao);
      if (!jsonAntigo) return false;
      const existe = jsonAntigo.find((el) => el.usuario_id === idUsuario);
      return existe && existe.situacao;
    });

    return algumProdutoMarcado || algumServicoMarcado;
  }

  // Função para auto-iniciar a tarefa quando marcar o primeiro item
  function autoIniciarTarefa(tarefaAtual) {
    if (tarefaAtual.status === 0) {
      api
        .put("/minhas-tarefas/" + tarefaAtual.id, {
          ...tarefaAtual,
          status: 1,
        })
        .then(() => {
          console.log("Tarefa iniciada automaticamente");
        })
        .catch((error) => {
          console.error("Erro ao iniciar tarefa:", error);
        });
    }
  }

  // Função para voltar tarefa para não iniciada
  function voltarParaNaoIniciada(tarefaAtual) {
    if (tarefaAtual.status === 1) {
      api
        .put("/minhas-tarefas/" + tarefaAtual.id, {
          ...tarefaAtual,
          status: 0,
        })
        .then(() => {
          console.log("Tarefa voltou para não iniciada");
        })
        .catch((error) => {
          console.error("Erro ao voltar tarefa:", error);
        });
    }
  }

  async function marcarProduto(element) {
    // Ativa o loading imediatamente
    setLoadingProdutoIds(prev => [...prev, element.pivot.produto_id]);
    
    try {
      const response = await searchSituacao(element.pivot.id, "produto");
      var jsonAntigo = JSON.parse(response.data.data.situacao);

      if (jsonAntigo == null) {
        var json = [
          {
            usuario_id: idUsuario,
            situacao: true,
          },
        ];
        postMarcarProduto(element, json);
        return;
      }

      const existe = jsonAntigo.find((el) => el.usuario_id === idUsuario);
      if (existe) {
        const jsonNovo = jsonAntigo.map((item) => {
          if (item.usuario_id === idUsuario) {
            item.situacao = !item.situacao;
          }
          return item;
        });
        postMarcarProduto(element, jsonNovo);
        return;
      }

      jsonAntigo.push({
        usuario_id: idUsuario,
        situacao: true,
      });
      postMarcarProduto(element, jsonAntigo);
    } catch (error) {
      setLoadingProdutoIds(prev => prev.filter(id => id !== element.pivot.produto_id));
      errorAlert("Atenção", error?.response?.data?.message || "Erro ao buscar situação do produto");
    }
  }

  function postMarcarProduto(element, json) {
    // Verifica se vai marcar ou desmarcar
    const usuarioJson = json.find((el) => el.usuario_id === idUsuario);
    const estaMarcando = usuarioJson && usuarioJson.situacao;

    // Verifica o estado antes da marcação
    const tinhaAlgumItemMarcado = algumItemMarcado(dados);

    api
      .post("/minhas-tarefas-produtos-marcar", {
        ordem_servico_id: element.pivot.ordem_servico_id,
        produto_id: element.pivot.produto_id,
        situacao: json,
      })
      .then(() => {
        // Atualiza os dados após a resposta
        return api.get("/minhas-tarefas/" + idUsuario + "/fazendo");
      })
      .then((response) => {
        // Encontra a tarefa atualizada
        const tarefaAtualizada = response.data["data"].find(
          (t) => t.id === dados.id,
        );
        
        if (tarefaAtualizada) {
          setDados(tarefaAtualizada);
          
          toast.success(
            estaMarcando
              ? "Produto marcado com sucesso!"
              : "Produto desmarcado com sucesso!",
          );

          // Auto-iniciar a tarefa se for o primeiro item marcado
          if (estaMarcando && !tinhaAlgumItemMarcado && dados.status === 0) {
            autoIniciarTarefa(dados);
          }

          // Verifica com os dados atualizados
          const agoraTemAlgumItem = algumItemMarcado(tarefaAtualizada);
          const todosMarcados = todosItensMarcados(tarefaAtualizada);

          // Voltar para não iniciada se desmarcar todos os itens
          if (!estaMarcando && !agoraTemAlgumItem && dados.status === 1) {
            voltarParaNaoIniciada(dados);
          }

          // Verificar se todos os itens foram finalizados
          if (estaMarcando && todosMarcados) {
            setTimeout(() => {
              finalizarAutomaticamente(dados);
            }, 500);
          } else {
            // Atualiza apenas a lista da tabela, sem reload do modal
            triggerRefresh();
          }
        }
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
        // Em caso de erro, recarrega os dados
        api.get("/minhas-tarefas/" + idUsuario + "/fazendo").then((response) => {
          const tarefaAtualizada = response.data["data"].find(
            (t) => t.id === dados.id,
          );
          if (tarefaAtualizada) {
            setDados(tarefaAtualizada);
          }
        });
      })
      .finally(() => {
        setLoadingProdutoIds(prev => prev.filter(id => id !== element.pivot.produto_id));
      });
  }

  function isProdutoMarked(element) {
    var jsonAntigo = JSON.parse(element.pivot.situacao);
    if (jsonAntigo == null) {
      return false;
    }
    const existe = jsonAntigo.find((el) => el.usuario_id === idUsuario);
    return !!existe && existe.situacao;
  }

  async function marcarServico(element) {
    // Ativa o loading imediatamente
    setLoadingServicoIds(prev => [...prev, element.pivot.servico_id]);
    
    try {
      const response = await searchSituacao(element.pivot.id, "servico");
      var jsonAntigo = JSON.parse(response.data.data.situacao);

      if (jsonAntigo == null) {
        var json = [
          {
            usuario_id: idUsuario,
            situacao: true,
          },
        ];
        postMarcarServico(element, json);
        return;
      }

      const existe = jsonAntigo.find((el) => el.usuario_id === idUsuario);
      if (existe) {
        const jsonNovo = jsonAntigo.map((item) => {
          if (item.usuario_id === idUsuario) {
            item.situacao = !item.situacao;
          }
          return item;
        });
        postMarcarServico(element, jsonNovo);
        return;
      }

      jsonAntigo.push({
        usuario_id: idUsuario,
        situacao: true,
      });
      postMarcarServico(element, jsonAntigo);
    } catch (error) {
      setLoadingServicoIds(prev => prev.filter(id => id !== element.pivot.servico_id));
      errorAlert("Atenção", error?.response?.data?.message || "Erro ao buscar situação do serviço");
    }
  }

  function postMarcarServico(element, json) {
    // Verifica se vai marcar ou desmarcar
    const usuarioJson = json.find((el) => el.usuario_id === idUsuario);
    const estaMarcando = usuarioJson && usuarioJson.situacao;

    // Verifica o estado antes da marcação
    const tinhaAlgumItemMarcado = algumItemMarcado(dados);

    api
      .post("/minhas-tarefas-servicos-marcar", {
        ordem_servico_id: element.pivot.ordem_servico_id,
        servico_id: element.pivot.servico_id,
        situacao: json,
      })
      .then(() => {
        // Atualiza os dados após a resposta
        return api.get("/minhas-tarefas/" + idUsuario + "/fazendo");
      })
      .then((response) => {
        // Encontra a tarefa atualizada
        const tarefaAtualizada = response.data["data"].find(
          (t) => t.id === dados.id,
        );
        
        if (tarefaAtualizada) {
          setDados(tarefaAtualizada);
          
          toast.success(
            estaMarcando
              ? "Serviço marcado com sucesso!"
              : "Serviço desmarcado com sucesso!",
          );

          // Auto-iniciar a tarefa se for o primeiro item marcado
          if (estaMarcando && !tinhaAlgumItemMarcado && dados.status === 0) {
            autoIniciarTarefa(dados);
          }

          // Verifica com os dados atualizados
          const agoraTemAlgumItem = algumItemMarcado(tarefaAtualizada);
          const todosMarcados = todosItensMarcados(tarefaAtualizada);

          // Voltar para não iniciada se desmarcar todos os itens
          if (!estaMarcando && !agoraTemAlgumItem && dados.status === 1) {
            voltarParaNaoIniciada(dados);
          }

          // Verificar se todos os itens foram finalizados
          if (estaMarcando && todosMarcados) {
            setTimeout(() => {
              finalizarAutomaticamente(dados);
            }, 500);
          } else {
            // Atualiza apenas a lista da tabela, sem reload do modal
            triggerRefresh();
          }
        }
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
        // Em caso de erro, recarrega os dados
        api.get("/minhas-tarefas/" + idUsuario + "/fazendo").then((response) => {
          const tarefaAtualizada = response.data["data"].find(
            (t) => t.id === dados.id,
          );
          if (tarefaAtualizada) {
            setDados(tarefaAtualizada);
          }
        });
      })
      .finally(() => {
        setLoadingServicoIds(prev => prev.filter(id => id !== element.pivot.servico_id));
      });
  }

  function isServicoMarked(element) {
    var jsonAntigo = JSON.parse(element.pivot.situacao);
    if (jsonAntigo == null) {
      return false;
    }
    const existe = jsonAntigo.find((el) => el.usuario_id === idUsuario);
    return !!existe && existe.situacao;
  }

  const DialogHeader = () => {
    const totalItems =
      (dados["ordem_servico"]?.produtos?.length || 0) +
      (dados["ordem_servico"]?.servicos?.length || 0);
    const produtos = dados["ordem_servico"]?.produtos || [];
    const servicos = dados["ordem_servico"]?.servicos || [];

    const produtosMarcados = produtos.filter((p) => isProdutoMarked(p)).length;
    const servicosMarcados = servicos.filter((s) => isServicoMarked(s)).length;
    const totalMarcados = produtosMarcados + servicosMarcados;
    const progresso =
      totalItems > 0 ? Math.round((totalMarcados / totalItems) * 100) : 0;

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
            <Typography variant="h6" component="div">
              {`Ordem de serviço N° ${dados["ordem_servico"]?.numero || ""}`}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}
            >
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
                sx={{
                  fontWeight: 700,
                }}
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
              {dados["ordem_servico"]?.produtos?.map((element, index) => {
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
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              marcarProduto(element);
                            }}
                            size="large"
                            disabled={loadingProdutoIds.includes(element.pivot.produto_id)}
                            sx={{
                              bgcolor: isMarked ? "success.main" : "error.main",
                              color: "white",
                              transition: "all 0.2s ease",
                              boxShadow: 2,
                              "&:hover": {
                                bgcolor: isMarked
                                  ? "success.dark"
                                  : "error.dark",
                                transform: "scale(1.15) rotate(5deg)",
                                boxShadow: 4,
                              },
                              "&:active": {
                                transform: "scale(0.9)",
                              },
                              "&.Mui-disabled": {
                                bgcolor: isMarked ? "success.main" : "error.main",
                                opacity: 0.7,
                              },
                            }}
                          >
                            {loadingProdutoIds.includes(element.pivot.produto_id) ? (
                              <CircularProgress size={24} sx={{ color: "white" }} />
                            ) : isMarked ? (
                              <CheckIcon />
                            ) : (
                              <CloseIcon />
                            )}
                          </IconButton>
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
                                  <strong>Obs:</strong>{" "}
                                  {element.pivot.observacao}
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
                sx={{
                  fontWeight: 700,
                }}
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
              {dados["ordem_servico"]?.servicos?.map((element, index) => {
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
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              marcarServico(element);
                            }}
                            size="large"
                            disabled={loadingServicoIds.includes(element.pivot.servico_id)}
                            sx={{
                              bgcolor: isMarked ? "success.main" : "error.main",
                              color: "white",
                              transition: "all 0.2s ease",
                              boxShadow: 2,
                              "&:hover": {
                                bgcolor: isMarked
                                  ? "success.dark"
                                  : "error.dark",
                                transform: "scale(1.15) rotate(5deg)",
                                boxShadow: 4,
                              },
                              "&:active": {
                                transform: "scale(0.9)",
                              },
                              "&.Mui-disabled": {
                                bgcolor: isMarked ? "success.main" : "error.main",
                                opacity: 0.7,
                              },
                            }}
                          >
                            {loadingServicoIds.includes(element.pivot.servico_id) ? (
                              <CircularProgress size={24} sx={{ color: "white" }} />
                            ) : isMarked ? (
                              <CheckIcon />
                            ) : (
                              <CloseIcon />
                            )}
                          </IconButton>
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
                                  <strong>Obs:</strong>{" "}
                                  {element.pivot.observacao}
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
    return <></>;
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
        title={"Ordens de Serviço - Em Andamento"}
        data={ordensServicosFuncionarios}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

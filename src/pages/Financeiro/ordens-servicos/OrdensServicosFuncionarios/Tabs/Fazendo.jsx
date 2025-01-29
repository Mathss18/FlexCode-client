import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../../../config/tablesConfig";
import { useFullScreenLoader } from "../../../../../context/FullScreenLoaderContext";
import CheckIcon from "@mui/icons-material/Check";
import moment from "moment";
import FullScreenDialog from "../../../../../components/dialog/FullScreenDialog";
import {
  AppBar,
  Avatar,
  Button,
  Chip, // <-- Import Chip
  Divider,
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
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  confirmAlert,
  errorAlert,
  textAreaAlert,
} from "../../../../../utils/alert";
import api from "../../../../../services/api";
import ModalFotoProduto from "./ModalFotoProduto";
import toast from "react-hot-toast";

export function Fazendo() {
  const { idUsuario } = useParams();
  const [openFotoModal, setOpenFotoModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [ordensServicosFuncionarios, setOrdensServicosFuncionarios] = useState(
    []
  );
  const fullScreenLoader = useFullScreenLoader();
  const [open, setOpen] = useState(false);
  const [dados, setDados] = useState({});

  // We add a new "Situação" column
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
      // New column for Situação
      name: "Situação",
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
      "Após finalizar, não será possivel desfazer essa ação",
      () => moveToFinalizadas(element)
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
          search();
        })
        .catch((error) => {
          errorAlert("Atenção", error?.response?.data?.message);
        })
        .finally(() => {
          fullScreenLoader.setLoading(false);
        });
    });
  }

  function search() {
    fullScreenLoader.setLoading(true);
    api
      .get("/minhas-tarefas/" + idUsuario + "/fazendo")
      .then((response) => {
        response.data["data"].forEach((element) => {
          // Calculate how many days overdue
          const now = moment();
          // We'll assume dataSaida is "Data Entrega"
          const dataSaida = moment(
            element["ordem_servico"].dataSaida,
            "YYYY-MM-DD"
          );
          const diff = now.diff(dataSaida, "days"); // how many days after dataSaida

          let chipLabel = "Em dia";
          let chipColor = "#4caf50"; // green by default

          if (diff === 1) {
            // 1 day late => orange
            chipColor = "#ec8232";
            chipLabel = `${diff} dia de atraso`;
          } else if (diff > 2) {
            // more than 2 days => red
            chipColor = "#c55959";
            chipLabel = `${diff} dias de atraso`;
          }

          data.push([
            element["ordem_servico"].numero, // N° Ordem de Servico
            element["ordem_servico"].cliente.nome, // Cliente
            moment(element["ordem_servico"].dataEntrada).format("DD/MM/YYYY") +
              " " +
              element["ordem_servico"].horaEntrada, // Data Abertura
            moment(element["ordem_servico"].dataSaida).format("DD/MM/YYYY") +
              " " +
              element["ordem_servico"].horaSaida, // Data Entrega

            // Situação column
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

            // Ações column
            <>
              <MoreHorizIcon
                className="btn btn-lista"
                onClick={(event) => {
                  handleOnClickShowButton(event, element);
                }}
              />
              <CheckIcon
                className="btn btn-lista"
                onClick={(event) => handleOnClickEditButton(event, element)}
              />
            </>,
          ]);
        });
        setOrdensServicosFuncionarios(data);

        if (response.data["data"].length === 0) {
          setOrdensServicosFuncionarios([]);
        }
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

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

  // === Produtos ===
  async function marcarProduto(element) {
    const response = await searchSituacao(element.pivot.id, "produto");
    var jsonAntigo = JSON.parse(response.data.data.situacao);

    if (jsonAntigo == null) {
      // ==== se não tiver nada, cria um novo json ====
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
      // Se já existir um registro, alterna
      const jsonNovo = jsonAntigo.map((item) => {
        if (item.usuario_id === idUsuario) {
          item.situacao = !item.situacao;
        }
        return item;
      });
      postMarcarProduto(element, jsonNovo);
      return;
    }

    // Se não existir um registro daquele usuario, cria
    jsonAntigo.push({
      usuario_id: idUsuario,
      situacao: true,
    });
    postMarcarProduto(element, jsonAntigo);
  }

  function postMarcarProduto(element, json) {
    api
      .post("/minhas-tarefas-produtos-marcar", {
        ordem_servico_id: element.pivot.ordem_servico_id,
        produto_id: element.pivot.produto_id,
        situacao: json,
      })
      .then(() => {
        toast.success("Produto marcado com sucesso!");
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => {
        setOpen(false);
        search();
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

  // === Serviços ===
  async function marcarServico(element) {
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
  }

  function postMarcarServico(element, json) {
    api
      .post("/minhas-tarefas-servicos-marcar", {
        ordem_servico_id: element.pivot.ordem_servico_id,
        servico_id: element.pivot.servico_id,
        situacao: json,
      })
      .then(() => {
        toast.success("Servico marcado com sucesso!");
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => {
        setOpen(false);
        search();
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
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {`Ordem de serviço N° ${dados["ordem_servico"]?.numero || ""}`}
          </Typography>
          <Button autoFocus color="inherit" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </Toolbar>
      </AppBar>
    );
  };

  const DialogBody = () => {
    return (
      <div>
        {/* Produtos */}
        <List
          style={{
            display:
              dados["ordem_servico"]?.produtos?.length !== 0 ? "block" : "none",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Produtos</h3>
          {dados["ordem_servico"]?.produtos?.map((element, index) => {
            return (
              <ListItem
                key={index}
                button
                onClick={() => {
                  setProdutoSelecionado(element);
                  setOpenFotoModal(true);
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    onClick={(e) => {
                      e.stopPropagation();
                      marcarProduto(element);
                    }}
                    style={{
                      background: isProdutoMarked(element)
                        ? "#00ff00"
                        : "#ff0000",
                    }}
                  >
                    {isProdutoMarked(element) ? (
                      <CheckIcon style={{ fill: "#000" }} />
                    ) : (
                      <CloseIcon style={{ fill: "#000" }} />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  style={{ flex: "none" }}
                  primary={element.nome}
                  secondary={"Código Interno: " + element.codigoInterno}
                />
                <ListItemText
                  style={{ flex: "none", marginLeft: 48 }}
                  primary={"Quantidade: " + element.pivot.quantidade}
                  secondary={
                    element.pivot.observacao
                      ? "Observações: " + element.pivot.observacao
                      : ""
                  }
                />
              </ListItem>
            );
          })}
          <Divider />
        </List>

        {/* Serviços */}
        <List
          style={{
            display:
              dados["ordem_servico"]?.servicos?.length !== 0 ? "block" : "none",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Serviços</h3>
          {dados["ordem_servico"]?.servicos?.map((element, index) => {
            return (
              <ListItem key={index} button>
                <ListItemAvatar>
                  <Avatar
                    onClick={(e) => {
                      e.stopPropagation();
                      marcarServico(element);
                    }}
                    style={{
                      background: isServicoMarked(element)
                        ? "#00ff00"
                        : "#ff0000",
                    }}
                  >
                    {isServicoMarked(element) ? (
                      <CheckIcon style={{ fill: "#000" }} />
                    ) : (
                      <CloseIcon style={{ fill: "#000" }} />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  style={{ flex: "none" }}
                  primary={element.nome}
                  secondary={"Código Interno: " + element.codigoInterno}
                />
                <ListItemText
                  style={{ flex: "none", marginLeft: 48 }}
                  primary={"Quantidade: " + element.pivot.quantidade}
                  secondary={
                    element.pivot.observacao
                      ? "Observações: " + element.pivot.observacao
                      : ""
                  }
                />
              </ListItem>
            );
          })}
          <Divider />
        </List>
      </div>
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
        title={"Minhas Ordens de Serviços - Fazendo"}
        data={ordensServicosFuncionarios}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

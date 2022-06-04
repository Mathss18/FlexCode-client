import { forwardRef, useEffect, useState } from "react";
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
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import PhotoIcon from "@mui/icons-material/Photo";
import BuildIcon from "@mui/icons-material/Build";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  confirmAlert,
  errorAlert,
  textAreaAlert,
} from "../../../../../utils/alert";
import api from "../../../../../services/api";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
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
        .put("/ordens-servicos-funcionarios/" + element.id, {
          ...element,
          status: 2,
          observacao: response,
          dataFinalizado: moment().format("YYYY-MM-DD"),
        })
        .then((response) => {
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
      .get("/ordens-servicos-funcionarios/" + idUsuario + "/fazendo")
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
              <CheckIcon
                className={"btn btn-lista"}
                onClick={(event) => handleOnClickEditButton(event, element)}
              />
            </>,
          ];
          data.push(array);
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

  useEffect(() => {
    search();
  }, []);

  // === Produtos ===
  function marcarProduto(element) {
    var jsonAntigo = JSON.parse(element.pivot.situacao);
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

    const existe = jsonAntigo.find(
      (element) => element.usuario_id === idUsuario
    );
    if (!!existe) {
      // ==== se já existir um registro daquele usuario, modifica o registro ====
      var jsonNovo = jsonAntigo.map((item) => {
        if (item.usuario_id === idUsuario) {
          item.situacao = !item.situacao;
        }
        return item;
      });
      postMarcarProduto(element, jsonNovo);
      return;
    }

    // ==== se não existir um registro daquele usuario, cria um pra ele ====
    jsonAntigo.push({
      usuario_id: idUsuario,
      situacao: true,
    });
    postMarcarProduto(element, jsonAntigo);
  }

  function postMarcarProduto(element, json) {
    api
      .post("/ordens-servicos-funcionarios-produtos-marcar", {
        ordem_servico_id: element.pivot.ordem_servico_id,
        produto_id: element.pivot.produto_id,
        situacao: json,
      })
      .then((response) => {
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
    const existe = jsonAntigo.find(
      (element) => element.usuario_id === idUsuario
    );
    if (!!existe && existe.situacao) {
      return true;
    }
    return false;
  }

  // === Serviços ===
  function marcarServico(element) {
    var jsonAntigo = JSON.parse(element.pivot.situacao);
    if (jsonAntigo == null) {
      // ==== se não tiver nada, cria um novo json ====
      var json = [
        {
          usuario_id: idUsuario,
          situacao: true,
        },
      ];
      postMarcarServico(element, json);

      return;
    }

    const existe = jsonAntigo.find(
      (element) => element.usuario_id === idUsuario
    );
    if (!!existe) {
      // ==== se já existir um registro daquele usuario, modifica o registro ====
      var jsonNovo = jsonAntigo.map((item) => {
        if (item.usuario_id === idUsuario) {
          item.situacao = !item.situacao;
        }
        return item;
      });
      postMarcarServico(element, jsonNovo);
      return;
    }

    // ==== se não existir um registro daquele usuario, cria um pra ele ====
    jsonAntigo.push({
      usuario_id: idUsuario,
      situacao: true,
    });
    postMarcarServico(element, jsonAntigo);
  }

  function postMarcarServico(element, json) {
    api
      .post("/ordens-servicos-funcionarios-servicos-marcar", {
        ordem_servico_id: element.pivot.ordem_servico_id,
        servico_id: element.pivot.servico_id,
        situacao: json,
      })
      .then((response) => {
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
    const existe = jsonAntigo.find(
      (element) => element.usuario_id === idUsuario
    );
    if (!!existe && existe.situacao) {
      return true;
    }
    return false;
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
            {`Ordem de serviço N° ${dados["ordem_servico"].numero}`}
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
        <List
          style={{
            display:
              dados["ordem_servico"].produtos.length !== 0 ? "block" : "none",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Produtos</h3>
          {dados["ordem_servico"].produtos.map((element, index) => {
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
                      background:
                        isProdutoMarked(element) === true
                          ? "#00ff00"
                          : "#ff0000",
                    }}
                  >
                    {isProdutoMarked(element) === true ? (
                      <CheckIcon style={{ fill: "#000" }} />
                    ) : (
                      <CloseIcon style={{ fill: "#000" }} />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  style={{
                    flex: "none",
                  }}
                  primary={element.nome}
                  secondary={"Código Interno: " + element.codigoInterno}
                />
                <ListItemText
                  style={{
                    flex: "none",
                    marginLeft: 48,
                  }}
                  primary={"Quantidade: " + element.pivot.quantidade}
                  secondary={
                    "Observações: " + element.pivot.observacao == null
                      ? ""
                      : element.pivot.observacao
                  }
                />
              </ListItem>
            );
          })}
          <Divider />
        </List>

        <List
          style={{
            display:
              dados["ordem_servico"].servicos.length !== 0 ? "block" : "none",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Serviços</h3>
          {dados["ordem_servico"].servicos.map((element, index) => {
            return (
              <ListItem key={index} button>
                <ListItemAvatar>
                  <Avatar
                    onClick={(e) => {
                      e.stopPropagation();
                      marcarServico(element);
                    }}
                    style={{
                      background:
                        isServicoMarked(element) === true
                          ? "#00ff00"
                          : "#ff0000",
                    }}
                  >
                    {isServicoMarked(element) === true ? (
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
                    "Observações: " + element.pivot.observacao == null
                      ? ""
                      : element.pivot.observacao
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

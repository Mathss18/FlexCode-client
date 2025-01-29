import { forwardRef, useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import api from "../../../../../services/api";

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
  Chip, // <-- Import Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import PhotoIcon from "@mui/icons-material/Photo";
import BuildIcon from "@mui/icons-material/Build";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { config, rowConfig } from "../../../../../config/tablesConfig";
import { confirmAlert, errorAlert } from "../../../../../utils/alert";
import { Dialog, Slide } from "@material-ui/core";
import ModalFotoProduto from "./ModalFotoProduto";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function Abertas() {
  const { idUsuario } = useParams();
  const [ordensServicosFuncionarios, setOrdensServicosFuncionarios] = useState(
    []
  );
  const fullScreenLoader = useFullScreenLoader();
  const [open, setOpen] = useState(false);
  const [openFotoModal, setOpenFotoModal] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [dados, setDados] = useState({});

  // Create a new column for "Situação"
  const columns = [
    {
      name: "N° OF",
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
      // New "Situação" column
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
    console.log(element);
    setDados(element);
    setOpen(true);
  }

  function handleOnClickEditButton(event, element) {
    confirmAlert(
      "Deseja iniciar essa tarefa?",
      "Após iniciar, não será possivel desfazer essa ação",
      () => moveToFazendo(element)
    );
  }

  function moveToFazendo(element) {
    fullScreenLoader.setLoading(true);
    api
      .put("/minhas-tarefas/" + element.id, {
        ...element,
        status: 1,
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
  }

  function search() {
    fullScreenLoader.setLoading(true);
    api
      .get("/minhas-tarefas/" + idUsuario + "/abertas")
      .then((response) => {
        response.data["data"].forEach((element) => {
          // Calculate how many days overdue
          // We'll assume 'element["ordem_servico"].dataSaida' is the "Data Entrega"
          const now = moment();
          const dataSaida = moment(
            element["ordem_servico"].dataSaida,
            "YYYY-MM-DD"
          );
          const diff = now.diff(dataSaida, "days"); // how many days after dataSaida

          let chipColor = "#4caf50"; // Default: green
          let chipLabel = "Em dia";

          if (diff === 1) {
            // 1 day late => orange
            chipColor = "#ec8232";
            chipLabel = `${diff} dia de atraso`;
          } else if (diff > 2) {
            // more than 2 days => red
            chipColor = "#c55959";
            chipLabel = `${diff} dias de atraso`;
          }
          // If you'd like negative diff to remain green (not yet due), we keep the defaults

          // Build the row array
          var array = [
            element["ordem_servico"].numero, // N° OF
            element["ordem_servico"].cliente.nome, // Cliente
            moment(element["ordem_servico"].dataEntrada).format("DD/MM/YYYY") +
              " " +
              element["ordem_servico"].horaEntrada, // Data Abertura
            moment(element["ordem_servico"].dataSaida).format("DD/MM/YYYY") +
              " " +
              element["ordem_servico"].horaSaida, // Data Entrega

            // Situação column with a Chip
            <Chip
              className="table-tag"
              label={chipLabel}
              size="small"
              style={{
                width: "120px",
                backgroundColor: chipColor,
                color: "#fff",
              }}
            />,

            // Ações
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
        console.log(response.data["data"], data);
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

  const DialogHeader = () => {
    return (
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
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
                  <Avatar style={{ background: "grey" }}>
                    <BubbleChartIcon style={{ fill: "white" }} />
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
                  <Avatar style={{ background: "grey" }}>
                    <BuildIcon style={{ fill: "white" }} />
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
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        style={{ zIndex: "3000" }}
      >
        <DialogHeader />
        <DialogBody />
        <DialogFooter />
      </Dialog>

      <MUIDataTable
        title={"Minhas Ordens de Serviços - Abertas"}
        data={ordensServicosFuncionarios}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

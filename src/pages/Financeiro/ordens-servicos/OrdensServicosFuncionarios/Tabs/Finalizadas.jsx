import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import api from "../../../../../services/api";
import { config, rowConfig } from "../../../../../config/tablesConfig";
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
import { useFullScreenLoader } from "../../../../../context/FullScreenLoaderContext";
import ModalFotoProduto from "./ModalFotoProduto";
import { Grid } from "@material-ui/core";

export function Finalizadas() {
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
  }, []);

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

        <List
          style={{
            display:
              dados["ordem_servico"].servicos.length !== 0 ? "block" : "none",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Serviços</h3>
          {dados["ordem_servico"].servicos.map((element, index) => {
            return (
              <ListItem
                key={index}
                button
              >
                <ListItemAvatar>
                  <Avatar
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
    return (
      <>
        <Grid container style={{ margin: 12, width: "fit-content" }}>
          <Grid item>
            <h3>Observações:</h3>
            <p>{dados?.observacao}</p>
          </Grid>
        </Grid>
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

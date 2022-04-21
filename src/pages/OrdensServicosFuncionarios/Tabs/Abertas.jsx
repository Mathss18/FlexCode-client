import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import { config, rowConfig } from "../../../config/tablesConfig";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import CheckIcon from "@mui/icons-material/Check";
import moment from "moment";
import FullScreenDialog from "../../../components/dialog/FullScreenDialog";
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
import { confirmAlert, infoAlert } from "../../../utils/alert";

export function Abertas() {
  const { idUsuario } = useParams();
  const history = useHistory();
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
      "Deseja iniciar essa tarefa?",
      "Após iniciar, não será possivel desfazer essa ação",
      () => moveToFazendo(element)
    );
  }

  function moveToFazendo(element) {
    fullScreenLoader.setLoading(true);
    api
      .put("/ordens-servicos-funcionarios/" + element.id, {
        ...element,
        status: 1,
        dataFinalizado: moment().format("YYYY-MM-DD"),
      })
      .then((response) => {
        search();
      })
      .catch((error) => {
        infoAlert("Atenção", error.response.data.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  function search() {
    fullScreenLoader.setLoading(true);
    api
      .get("/ordens-servicos-funcionarios/" + idUsuario + "/abertas")
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
        console.log(response.data["data"], data);
        setOrdensServicosFuncionarios(data);

        if(response.data["data"].length === 0){
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
        <List>
          <h3 style={{ textAlign: "center" }}>Produtos</h3>
          {dados["ordem_servico"].produtos.map((element, index) => {
            return (
              <ListItem
                key={index}
                button
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <PhotoIcon style={{ fill: "grey" }} />
                  </IconButton>
                }
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
                  secondary={"Observações: " + element.pivot.observacao}
                />
              </ListItem>
            );
          })}
          <Divider />
        </List>

        <List>
          <h3 style={{ textAlign: "center" }}>Serviços</h3>
          {dados["ordem_servico"].servicos.map((element, index) => {
            return (
              <ListItem
                key={index}
                button
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <PhotoIcon style={{ fill: "grey" }} />
                  </IconButton>
                }
              >
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
                  secondary={"Observações: " + element.pivot.observacao}
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
      <FullScreenDialog
        open={open}
        setOpen={setOpen}
        Header={DialogHeader}
        Body={DialogBody}
        Footer={DialogFooter}
      />

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

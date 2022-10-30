import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import { Button, Chip, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { config, rowConfig } from "../../../config/tablesConfig";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import api from "../../../services/api";
import moment from "moment";
import FullScreenDialog from "../../../components/dialog/FullScreenDialog";
import AppBarDialog from "./components/AppBarDialog";
import BodyDialog from "./components/BodyDialog";
import { errorAlert } from "../../../utils/alert";

function ListarOrdensServicos() {
  const history = useHistory();
  const [ordensServicos, setOrdensServicos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [open, setOpen] = useState(false);
  const [dadosOrdemServico, setDadosOrdemServico] = useState([]);

  const columns = [
    {
      name: "Número",
      options: rowConfig,
    },
    {
      name: "Cliente",
      options: rowConfig,
    },
    {
      name: "Situacao",
      options: rowConfig,
    },
    {
      name: "Data Entrada",
      options: rowConfig,
    },
    {
      name: "Data Saida",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const DialogHeader = () => {
    return (
      <>
        <AppBarDialog
          nomesFuncionarios={dadosOrdemServico?.nomesFuncionarios}
          setSelectedFuncionario={setSelectedFuncionario}
        />
      </>
    );
  };

  const DialogBody = () => {
    return (
      <>
        <BodyDialog
          selectedFuncionario={selectedFuncionario}
          ordemServico={dadosOrdemServico}
        />
      </>
    );
  };

  const DialogFooter = () => {
    return <></>;
  };

  const data = [];

  function handleOnClickEditButton(event, id) {
    history.push("/ordens-servicos/editar/" + id);
  }

  function handleOnClickAccessTime(event, id) {
    fullScreenLoader.setLoading(true);
    setDadosOrdemServico([]);
    api
      .get(`/ordens-servicos-progresso/${id}`)
      .then((response) => {
        setDadosOrdemServico(response.data.data);
      })
      .catch((error)=>{
        errorAlert("Atenção", "Erro ao trazer informações");
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
    setOpen(true);
  }

  function handleOnClickPdfButton(event, item) {
    const BASE_URL = window.location.origin;
    const data = btoa(JSON.stringify(item));
    localStorage.setItem("ordemServicoReport", data);

    window.open(`${BASE_URL}/ordens-servicos/relatorio`, "_blank");
    // window.print();
    // mywindow.document.appendChild(html);
    // mywindow.document.close(); // necessary for IE >= 10
    // mywindow.focus(); // necessary for IE >= 10*/

    // mywindow.print();
    // mywindow.close();
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/ordens-servicos")
      .then((response) => {
        response.data["data"].forEach((element) => {
          if (element["situacao"] === 0) {
            element["situacao"] = "Aberta";
          } else if (element["situacao"] === 1) {
            element["situacao"] = "Fazendo";
          } else if (element["situacao"] === 2) {
            element["situacao"] = "Finalizada";
          } else if (element["situacao"] === 3) {
            element["situacao"] = "Cancelada";
          }
          var array = [
            element["numero"],
            element["cliente"]["nome"],
            <Chip
              className="table-tag"
              label={element["situacao"]}
              color={
                element["situacao"] === "Aberta"
                  ? "primary"
                  : element["situacao"] === "Fazendo"
                  ? "secondary"
                  : element["situacao"] === "Finalizada"
                  ? "secondary"
                  : "error"
              }
              size="small"
              style={{
                width: "90px",
                backgroundColor:
                  element["situacao"] === "Cancelada" ? "#c55959" : "",
              }}
            />,
            moment(element["dataEntrada"]).format("DD/MM/YYYY") +
              " " +
              element["horaEntrada"],
            element["dataSaida"] == null
              ? ""
              : moment(element["dataSaida"]).format("DD/MM/YYYY") +
                " " +
                element["horaSaida"],
            <>
              <Tooltip title={"Baixar PDF"} arrow>
                <InsertDriveFileIcon
                  className={"btn btn-lista"}
                  onClick={(event) => handleOnClickPdfButton(event, element)}
                />
              </Tooltip>
              <AccessTimeIcon
                className={"btn btn-lista"}
                onClick={(event) => {
                  handleOnClickAccessTime(event, element["id"]);
                }}
              />
              <EditIcon
                className={"btn btn-lista"}
                onClick={(event) =>
                  handleOnClickEditButton(event, element["id"])
                }
              />
            </>,
          ];
          data.push(array);
        });
        setOrdensServicos(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <FullScreenDialog
        open={open}
        setOpen={setOpen}
        Header={DialogHeader}
        Body={DialogBody}
        Footer={DialogFooter}
      />
      <Button
        onClick={() => history.push("/ordens-servicos/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Ordens de Serviços"}
        data={ordensServicos}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarOrdensServicos;

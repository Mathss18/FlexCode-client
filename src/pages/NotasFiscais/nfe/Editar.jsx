import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Button,
  Tooltip,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from "@mui/icons-material/Help";
import InputMask from "react-input-mask";
import AssignmentIcon from "@material-ui/icons/Assignment";
import api from "../../../services/api";
import {
  confirmAlert,
  errorAlert,
  infoAlert,
  successAlert,
  textAreaAlert,
} from "../../../utils/alert";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import moment from "moment";

function EditarNotasFiscaisPage() {
  const history = useHistory();
  const { id } = useParams();
  const fullScreenLoader = useFullScreenLoader();
  const [notaFiscal, setNotaFiscal] = useState({});

  useEffect(() => {
    carregarNfe();
  }, []);

  function carregarNfe() {
    fullScreenLoader.setLoading(true);
    api
      .get("/notas-fiscais/" + id)
      .then((response) => {
        setNotaFiscal(response.data.data);
      })
      .catch((error) => {
        errorAlert("Atenção", error?.response?.data?.message);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }

  function handleOnClickCorrigirButton(event) {
    var justificativa = textAreaAlert(
      "Carta de correção",
      "Digite a justificativa aqui..."
    );
    justificativa.then((value) => {
      if (value?.trim()?.length < 15) {
        errorAlert(
          "Atenção",
          "A justificativa deve ter no mínimo 15 caracteres."
        );
        return;
      }
      api
        .post("/notas-fiscais/corrigir", {
          id: notaFiscal.id,
          chave: notaFiscal.chaveNF,
          nSeqEvento: notaFiscal.nSeqEvento,
          justificativa: value,
        })
        .then((response) => {
          successAlert("Sucesso", response.data.message);
          carregarNfe();
        })
        .catch((error) => {
          errorAlert("Atenção", error?.response?.data?.message);
        });
    });
  }

  function handleOnClickCancelarButton(event) {
    var justificativa = textAreaAlert(
      "Cancelamento",
      "Digite a justificativa aqui..."
    );
    justificativa.then((value) => {
      if (value?.trim()?.length < 15) {
        errorAlert(
          "Atenção",
          "A justificativa deve ter no mínimo 15 caracteres."
        );
        return;
      }
      api
        .post("/notas-fiscais/cancelar", {
          id: notaFiscal.id,
          chave: notaFiscal.chaveNF,
          protocolo: notaFiscal.protocolo,
          justificativa: value,
        })
        .then((response) => {
          successAlert("Sucesso", response.data.message);
          carregarNfe();
        })
        .catch((error) => {
          errorAlert("Atenção", error?.response?.data?.message);
        });
    });
  }

  async function sendNfeEmail(tipo, content) {
    var emailsParaEnviar = [];

    const response = await api.get(
      `/${notaFiscal?.tipoFavorecido}/` + notaFiscal?.favorecido_id
    );
    emailsParaEnviar = response.data.data.emailDocumento?.split(",");

    fullScreenLoader.setLoading(true);
    var mes = moment(notaFiscal?.created_at).format("MM");
    var ano = moment(notaFiscal?.created_at).format("YYYY");

    emailsParaEnviar.forEach((item) => {
      api
        .post("/notas-fiscais-email-nfe", {
          email: item?.trim(),
          titulo: `${notaFiscal?.favorecido_nome}, ${content.title}`,
          conteudo: `Segue em anexo os ducomentos referente a Nfe chave: ${notaFiscal.chaveNF}`,
          mes: mes,
          ano: ano,
          chave: notaFiscal.chaveNF,
          tipo: tipo, // nfe / cc / cancelada
        })
        .then((response) => {
          successAlert("Sucesso", response.data.message);
        })
        .catch((error) => {
          errorAlert("Atenção", error?.response?.data?.message);
        })
        .finally(() => fullScreenLoader.setLoading(false));
    });
  }

  return (
    <>
      <Divider />
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <AssignmentIcon />
        <h3>Dados da Nota Fiscal</h3>
      </div>
      <div>
        <Grid container spacing={2}>
          <Grid item>
            <iframe
              style={{ border: "2px solid black" }}
              src={notaFiscal.danfe}
              width="600"
              height="780"
            ></iframe>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="outlined"
              startIcon={<AttachEmailIcon />}
              className={"btn btn-primary btn-spacing"}
              onClick={() =>
                sendNfeEmail("nfe", {
                  title: "Sua nota fiscal já está disponível!",
                })
              }
            >
              Enviar NFe por email
            </Button>
            <br />
            <Button
              type="submit"
              variant="outlined"
              startIcon={<AutoFixHighIcon />}
              className={"btn btn-primary btn-spacing"}
              onClick={handleOnClickCorrigirButton}
            >
              Carta de correção
            </Button>
            <br />
            <Button
              type="submit"
              variant="outlined"
              startIcon={<HighlightOffIcon />}
              className={"btn btn-primary btn-spacing"}
              onClick={handleOnClickCancelarButton}
            >
              Cancelar NFe
            </Button>
            <br />
            <Button
              type="submit"
              variant="outlined"
              startIcon={<FindInPageIcon />}
              className={"btn btn-primary btn-spacing"}
              onClick={() => {
                window.open(notaFiscal.xml, "_blank");
              }}
            >
              Exibir XML
            </Button>
            <br />
            <Button
              type="submit"
              variant="outlined"
              startIcon={<FindInPageIcon />}
              className={"btn btn-error btn-spacing"}
              onClick={() => {
                window.open(notaFiscal.cancelamentoXml, "_blank");
              }}
              style={{
                display: notaFiscal.situacao === "Cancelada" ? "flex" : "none",
              }}
            >
              Exibir XML de cancelamento
            </Button>
            <Button
              type="submit"
              variant="outlined"
              startIcon={<AttachEmailIcon />}
              className={"btn btn-error btn-spacing"}
              onClick={() =>
                sendNfeEmail("cancelada", {
                  title: "Sua nota fiscal foi cancelada!",
                })
              }
              style={{
                display: notaFiscal.situacao === "Cancelada" ? "flex" : "none",
              }}
            >
              Enviar Cancelamento por email
            </Button>
            <h2
              style={{
                display: notaFiscal.situacao === "Cancelada" ? "block" : "none",
              }}
            >
              Essa nota fiscal foi cancelada!
            </h2>
          </Grid>

          <Grid
            item
            style={{ display: notaFiscal.correcaoXml ? "inline-flex" : "none" }}
          >
            <iframe
              style={{ border: "2px solid black" }}
              src={notaFiscal.correcaoPdf}
              width="600"
              height="780"
            ></iframe>
          </Grid>
          <Grid
            item
            style={{ display: notaFiscal.correcaoXml ? "block" : "none" }}
          >
            <Button
              type="submit"
              variant="outlined"
              startIcon={<AttachEmailIcon />}
              className={"btn btn-primary btn-spacing"}
              onClick={() =>
                sendNfeEmail("cc", {
                  title: "Sua carta de correção já está disponível!",
                })
              }
            >
              Enviar C.C por email
            </Button>
            <br />
            <Button
              type="submit"
              variant="outlined"
              startIcon={<FindInPageIcon />}
              className={"btn btn-primary btn-spacing"}
              onClick={() => {
                window.open(notaFiscal.correcaoXml, "_blank");
              }}
            >
              Exibir XML
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default EditarNotasFiscaisPage;

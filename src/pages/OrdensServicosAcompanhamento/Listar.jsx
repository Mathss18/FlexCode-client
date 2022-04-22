import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import api from "../../services/api";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import BuildIcon from "@mui/icons-material/Build";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import { decrypt } from "../../utils/ctypto"

//Onde 0:realizado, 1:emAndamento, 2:finalizado, 3:cancelado

export default function ListarOrdensServicosAcompanhamento() {
  const fullScreenLoader = useFullScreenLoader();
  const { encrypted } = useParams();
  const [decrypted, setDecrypted] = useState(null);
  
  const [dadosAcompanhamento, setDadosAcompanhamento] = useState(null);

  const steps = [
    "Realizado",
    "Em Andamento",
    "Finalizado",
  ];

  // Linha de conexão
  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },

    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));

  // Circulo com icone dentro
  const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
      boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
      backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
    }),
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
      1: <ContentPasteIcon />,
      2:
        dadosAcompanhamento?.situacao === 3 ? (
          <ErrorOutlineIcon style={{ fill: "#d32f2f" }} />
        ) : (
          <PendingOutlinedIcon />
        ),
      3: <CheckCircleOutlinedIcon />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  //Faz uma "request" para trazer os dados da ordem de serviço
  useEffect(() => {
    setDecrypted(decrypt(encrypted));
  }, []);

  useEffect(() => {
    if(decrypted===null) return;
    fullScreenLoader.setLoading(true);
    api
      .get("/ordens-servicos-acompanhar/"+decrypted)
      .then((response) => {
        setDadosAcompanhamento(response.data["data"]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  },[decrypted]);

  return (
    <div style={{display: !dadosAcompanhamento ? 'none' : 'block'}}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "#0796e7" }}>
          <Toolbar variant="dense">
            <Typography variant="h6" style={{ marginLeft: "1%" }}>
              Acompanhamento do Pedido nº{" "}
              {dadosAcompanhamento?.numero}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <div style={{ textAlign: "center" }}>
        <Typography style={{ margin: 8, fontSize: 24 }}>
          Olá, {dadosAcompanhamento?.cliente?.nome}! 
        </Typography>
          <br/>
        <Typography style={{ marginBottom: 12 }}>
          Acompanhe o andamento de seu pedido abaixo.
        </Typography>

        <Stepper
          alternativeLabel
          activeStep={
            dadosAcompanhamento?.situacao === 3
              ? 1
              : dadosAcompanhamento?.situacao
          }
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                error={
                  index === 1 && dadosAcompanhamento?.situacao === 3
                    ? true
                    : false
                }
                StepIconComponent={ColorlibStepIcon}
              >
                {index === 1 && dadosAcompanhamento?.situacao === 3
                  ? "Pedido cancelado"
                  : label}
                <br />
                <small>
                  {index === 0
                    ? `${moment(dadosAcompanhamento?.dataEntrada).format(
                        "DD/MM/YYYY"
                      )}  ${dadosAcompanhamento?.horaEntrada}`
                    : ""}
                </small>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <div style={{ display: "inline-block" }}>
          <h4>Produtos</h4>
          {dadosAcompanhamento &&
            dadosAcompanhamento?.produtos.map((produto,index) => (
              <List key={index}>
                <ListItem>
                  <ListItemIcon>
                    <TakeoutDiningIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${produto.pivot.quantidade}x ${produto.nome}`}
                    secondary={produto.pivot.observacao}
                  />
                </ListItem>
              </List>
            ))}

          <h4>Servicos</h4>
          {dadosAcompanhamento &&
            dadosAcompanhamento?.servicos.map((servico,index) => (
              <List key={index}>
                <ListItem>
                  <ListItemIcon>
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${servico.pivot.quantidade}x ${servico.nome}`}
                    secondary={servico.pivot.observacao}
                  />
                </ListItem>
              </List>
            ))}

          <p style={{ maxWidth: 1000 }}>
            <b>Observações: </b>{dadosAcompanhamento?.observacao}
          </p>
        </div>
      </div>
    </div>
  );
}

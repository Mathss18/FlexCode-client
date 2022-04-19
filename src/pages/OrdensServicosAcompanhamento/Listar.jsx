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
import { red } from "@material-ui/core/colors";

//Onde 0:realizado, 1:emAndamento, 2:finalizado
const dados = [
  {
    numero: "0001",
    nomeCliente: "Matheus Bezerra",
    situacao: 0,
    observacao: "Obs",
  },
  {
    numero: "0002",
    nomeCliente: "Cleide Soares",
    situacao: 2,
    observacao: "O seu pedido vai ser entregue antes do prazo!",
  },
  {
    numero: "0003",
    nomeCliente: "Allanda Soares",
    situacao: 1,
    observacao: "O seu pedido irá atrasar 2 dias",
  },
  {
    numero: "0004",
    nomeCliente: "Arthur Soares",
    situacao: 0,
    observacao: "O seu pedido vai ser entregue antes do prazo!",
  },
];

export default function ListarOrdensServicosAcompanhamento() {
  const idCliente = "0002";
  const [dadosAcompanhamento, setDadosAcompanhamento] = useState({});

  const steps = [
    "Pedido Realizado",
    "Pedido em Andamento",
    "Pedido Finalizado",
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
      2: <PendingOutlinedIcon />,
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
    api
      .get("/ordens-servicos")
      .then(() => {
        dados.map((item) => {
          if (idCliente === item.numero) {
            setDadosAcompanhamento(item);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <h1>Olá {dadosAcompanhamento.nomeCliente}!</h1>
      <p>Acompanhe seu pedido aqui.</p>

      <Stepper
        alternativeLabel
        activeStep={dadosAcompanhamento.situacao}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <p>{dadosAcompanhamento.observacao}</p>
    </>
  );
}

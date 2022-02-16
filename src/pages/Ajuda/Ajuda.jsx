import "./ajuda.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DraftsRoundedIcon from '@mui/icons-material/DraftsRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";

function Ajuda() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (painel) => (event, isExpanded) => {
    setExpanded(isExpanded ? painel : false);
  };

  return (
    <section className="containerAjuda">
      <div className="tituloAjuda">
        <h1> Ajuda e suporte</h1>
      </div>

      <div className="contentAjuda">
        <Accordion
          onChange={handleChange("painel1")}
          className="accordionAjuda"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ContactPhoneIcon />
            <Typography
              sx={{
                width: "33%",
                flexShrink: 0,
                color: "#a9b5b8",
                paddingLeft: "10px",
              }}
            >
              Contato
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container className="contentRow" style={{ marginTop: 10 }}>
              <LocalPhoneOutlinedIcon className="iconAjuda" />
              <Typography sx={{ paddingLeft: "10px" }}> Telefone </Typography>

              <Grid container>
                <Typography sx={{ paddingLeft: "30px" }}>
                  {" "}
                  (19) 3313456{" "}
                </Typography>
              </Grid>
            </Grid>

            <Grid container className="contentRow" style={{ marginTop: 30 }}>
              <WhatsAppIcon className="iconAjuda" />
              <Typography sx={{ paddingLeft: "10px" }}>Whatsapp</Typography>

              <Grid container>
                <Typography
                  sx={{ paddingLeft: "30px", display: "inline-block" }}
                >
                  {" "}
                  (19) 9 9999999{" "}
                </Typography>
              </Grid>
            </Grid>

            <Grid container className="contentRow" style={{ marginTop: 30 }}>
              <MailOutlineIcon className="iconAjuda" />
              <Typography sx={{ paddingLeft: "10px" }}>E-mail</Typography>

              <Grid container>
                <Typography sx={{ paddingLeft: "30px" }}>
                  {" "}
                  theus.7@hotmail.com{" "}
                </Typography>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion
          onChange={handleChange("painel1")}
          className="accordionAjuda"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <HelpCenterIcon sx={{ marginLeft: 0 }} />
            <Typography
              sx={{
                width: "33%",
                flexShrink: 0,
                color: "#a9b5b8",
                paddingLeft: "10px",
              }}
            >
              Tutorial
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container className="contentRow" style={{ marginTop: 10 }}>
              <AddBoxRoundedIcon className="iconAjuda" />
              <Typography sx={{ paddingLeft: "10px" }}> Cadastros </Typography>
            </Grid>

            <Grid container className="contentRow" style={{ marginTop: 30 }}>
              <ShoppingCartRoundedIcon className="iconAjuda" />
              <Typography sx={{ paddingLeft: "10px" }}> Produtos </Typography>
            </Grid>

            <Grid container className="contentRow" style={{ marginTop: 30 }}>
              <SendRoundedIcon className="iconAjuda" />
              <Typography sx={{ paddingLeft: "10px" }}>Sent mail</Typography>
            </Grid>

            <Grid container className="contentRow" style={{ marginTop: 30 }}>
              <DraftsRoundedIcon className="iconAjuda" />
              <Typography sx={{ paddingLeft: "10px" }}>Drafts</Typography>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </div>
    </section>
  );
}

export default Ajuda;

import { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import toast from "react-hot-toast";
import api from "../../services/api";

function Imposto() {
  const [icms, setIcms] = useState(null);
  const [ipi, setIpi] = useState(null);

  useEffect(() => {
    api
      .get("/relatorios/impostos")
      .then((response) => {
        const { icms, ipi } = response.data.data;
        setIcms(icms);
        setIpi(ipi);
      })
      .catch(() => {
        toast.error("Erro ao carregar os impostos.");
      });
  }, []);

  return (
    <Grid container spacing={3} justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={6}>
        <Card
          className="cardBackground"
          variant="outlined"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              ICMS
            </Typography>
            <Typography variant="h6" color="green" style={{ fontWeight: "bold" }}>
              {icms !== null
                ? `${icms.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}`
                : "Carregando..."}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card
          className="cardBackground"
          variant="outlined"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Typography variant="h5" color="primary" gutterBottom>
              IPI
            </Typography>
            <Typography variant="h6" color="green" style={{ fontWeight: "bold" }}> 
              {ipi !== null
                ? `${ipi.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}`
                : "Carregando..."}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Imposto;

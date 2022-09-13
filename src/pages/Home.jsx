import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import DashboardCard from "../components/dashboard//DashboardCard";
import DashboarContasBancarias from "../components/dashboard/DashboarContasBancarias";
import DashboardChart from "../components/dashboard/DashboardChart";
import DashboardMap from "../components/dashboard/DashboardMap";
import DashboarMetasVendas from "../components/dashboard/DashboarMetasVendas";
import { useFullScreenLoader } from "../context/FullScreenLoaderContext";
import api from "../services/api";
import { errorAlert } from "../utils/alert";
import { decrypt } from "../utils/crypto";

// Load Highcharts modules
import Highcharts from "highcharts";
import DashboarMelhoresClientes from "../components/dashboard/DashboarMelhoresClientes";
import toast from "react-hot-toast";
require("highcharts/modules/drilldown")(Highcharts);
require("highcharts/modules/bullet")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);
require("highcharts/highcharts-3d")(Highcharts);

function Home() {
  const fullScreenLoader = useFullScreenLoader();
  const [dados, setDados] = useState(null);
  const [accessToRelatorios, setAccessToRelatorios] = useState(false);

  function temAcessoARelatorios() {
    try {
      var grupo = JSON.parse(decrypt(localStorage.getItem("grupo")));
      var acessos = JSON.parse(grupo.acessos);
      setAccessToRelatorios(
        acessos.find((item) => item.path === "/relatorios").situacao
      );
    } catch (error) {
      toast.error("Erro ao carregar acessos, fale com o suporte!");
    }
  }

  useEffect(() => {
    temAcessoARelatorios();
    fullScreenLoader.setLoading(true);
    api
      .get("/dashboards")
      .then((response) => {
        setDados(response.data["data"]);
      })
      .catch((error) => {
        errorAlert("Erro ao carregar dados", error?.data?.message);
      })
      .finally(() => fullScreenLoader.setLoading(false));
  }, []);

  return (
    <>
      {accessToRelatorios && (
        <div style={{ width: "99%" }}>
          <Grid container>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <h2>
                Bem vindo, {JSON.parse(localStorage.getItem("user")).nome}
              </h2>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <DashboardCard type="green" dados={dados} />
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <DashboardCard type="red" dados={dados} />
            </Grid>
            <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
              <DashboardCard type="blue" dados={dados} />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className={"chart-container"}>
                <DashboarContasBancarias dados={dados} />
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className={"chart-container"}>
                <DashboardMap dados={dados} />
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className={"chart-container"}>
                <DashboarMetasVendas dados={dados} />
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <div className={"chart-container"}>
                <DashboarMelhoresClientes dados={dados} />
              </div>
            </Grid>
          </Grid>
          {/* <Grid container spacing={3}>
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <DashboardCard type="blue" dados={dados} />
            </Grid>
          </Grid> */}
        </div>
      )}
    </>
  );
}

export default Home;

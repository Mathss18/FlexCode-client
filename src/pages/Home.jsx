import { makeStyles } from "@material-ui/core/styles";
import DashboardCard from "../components/dashboard//DashboardCard";
import DashboardChart from "../components/dashboard/DashboardChart";

const useStyles = makeStyles((theme) => ({
  card_conteiner: {
    boxSizing: "border-box",
    display: "flex",
    flexWrap: "wrap",
  },
  chart_conteiner: {
    display: "flex",
    boxSizing: "border-box",
    width: "830px",
    height: "450px",
    marginLeft: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: "10px",
    backgroundColor: "white",
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.card_conteiner}>
        <DashboardCard type="green" />
        <DashboardCard type="red" />
        <DashboardCard type="blue" />
      </div>

      <h1>TEEEEE AMOOOOOO MEU CHEIRINHO LINDO</h1>

      <div className={classes.chart_conteiner + ' ' + 'chart-container'}>
        <DashboardChart />
      </div>
    </div>
  );
}

export default Home;

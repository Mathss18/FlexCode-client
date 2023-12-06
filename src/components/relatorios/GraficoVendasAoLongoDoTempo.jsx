import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment";

function GraficoVendasAoLongoDoTempo({ dados }) {
  const options = {
    chart: {
      type: "column",
      options3d: {
        enabled: true,
        alpha: 0,
        beta: 0,
        depth: 80,
      },
    },
    title: {
      text: "Vendas ao longo do tempo",
    },
    subtitle: {
      text: "Veja a evolução das vendas de sua empresa",
    },
    plotOptions: {
      column: {
        depth: 100,
      },
    },
    xAxis: {
      categories: dados?.map(item=>(
        item.periodo
      )),
      labels: {
        skew3d: true,
        style: {
          fontSize: "16px",
        },
      },
      gridLineWidth: 0,
    },
    yAxis: {
      title: {
        text: null,
      },
      
    },
    series: [
      {
        name: "Vendas",
        data: dados?.map(item=>(
          item.balancoFinal
        )),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} style={{height: '800px'}}/>;
}

export default GraficoVendasAoLongoDoTempo;

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment";

function GraficoPatrimonioAoLongoDoTempo({ dados }) {
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
      text: "Patrimônio ao longo do tempo",
    },
    subtitle: {
      text: "Veja a evolução do pratimônio de sua empresa",
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
        name: "Patrimônio",
        data: dados?.map(item=>(
          item.balancoFinal.toFixed(2)
        )),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} style={{height: '800px'}}/>;
}

export default GraficoPatrimonioAoLongoDoTempo;

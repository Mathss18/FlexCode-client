import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

function GraficoPrevisaoDeSaldo({ dados }) {
  const options = {
    chart: {
      type: "spline",
    },
    title: {
      text: "Previsão de saldo",
    },
    subtitle: {
      text: "Veja a evolução do saldo de sua empresa",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    },
    xAxis: {
      categories: dados?.datas,
    },
    yAxis: {
      title: {
        text: "Saldo Bancário",
      },
    },
    series: dados?.valores,

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      style={{ height: "800px" }}
    />
  );
}

export default GraficoPrevisaoDeSaldo;

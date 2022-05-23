import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

function DashboarMelhoresClientes({ dados }) {
  var pieColors = (function () {
    var colors = [],
      base = Highcharts.getOptions().colors[0],
      i;

    for (i = 0; i < 10; i += 1) {
      // Start out with a darkened base color (negative brighten), and end
      // up with a much brighter color
      colors.push(
        Highcharts.color(base)
          .brighten((i - 3 - 5) / 15)
          .get()
      );
    }
    return colors;
  })();

  var options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
      return {
        radialGradient: {
          cx: 0.5,
          cy: 0.3,
          r: 0.7,
        },
        stops: [
          [0, color],
          [1, Highcharts.color(color).brighten(-0.3).get("rgb")], // darken
        ],
      };
    }),
    title: {
      text: "Clientes que mais compram neste mês",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Porcentagem",
        colorByPoint: true,
        data: dados?.melhoresClientes,
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default DashboarMelhoresClientes;

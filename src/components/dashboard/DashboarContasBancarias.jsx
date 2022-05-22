import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import drilldow from "highcharts/modules/drilldown";
import moment from "moment";
// Load Highcharts modules

function DashboarContasBancarias({ dados }) {
  drilldow(Highcharts);

  const options = {
    chart: {
      type: "column",
    },
    title: {
      align: "center",
      text: "Saldo das contas bancarias",
    },
    subtitle: {
      align: "center",
      text: "Clique para a movimentação nos últimos 30 dias",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Valor total em R$",
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "R$: {point.y:.2f}",
          style: {
            color: "white",
            textOutline: "white",
            fill: "white",
            stroke: "none",
          },
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>R$: {point.y:.2f}</b><br/>',
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormatter: function () {
          if (this.series.chart.drilldownLevels !== undefined && this.series.chart.drilldownLevels.length > 0) {
            console.log(this);
              return '<span style="color:' + this.color + '">' + this.name + '</span>: <b>R$: ' + this.y.toFixed(2) + '</b><br/>';
          } else {
              return '<span style="color:' + this.color + '">' + this.name + '</span>: <b>R$: ' + this.y.toFixed(2) + '</b><br/>';
          }
      }
  },

    series: [
      {
        name: "Banco",
        colorByPoint: true,
        data: dados?.contasBancarias?.map((item) => {
          return {
            id: item.id,
            name: item.nome,
            y: item.saldo,
            drilldown: item.nome,
          };
        }),
      },
    ],
    drilldown: {
      breadcrumbs: {
        position: {
          align: "right",
        },
      },
      series: dados?.contasBancarias?.map((item) => {
        return {
          id: item.nome,
          name: item.nome,
          data: item.transacoes?.map((elem) => {
            return elem.tipo == "rendimento"
              ? [
                  moment(elem.dataTransacaoRegistrada).format(
                    "DD/MM/YYYY HH:mm:ss"
                  ),
                  elem.valor,
                  elem.favorecido_nome
                ]
              : [
                  moment(elem.dataTransacaoRegistrada).format(
                    "DD/MM/YYYY HH:mm:ss"
                  ),
                  elem.valor * -1,
                  elem.favorecido_nome
                ];
          }),
        };
      }),
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default DashboarContasBancarias;

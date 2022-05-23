import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment";

function DashboarMetasVendas({ dados }) {
  var options = {
    chart: {
      marginTop: 40,
      inverted: true,
      marginLeft: 135,
      type: "bullet",
    },
    title: {
      text: "Meta de vendas "+new Date().getFullYear(),
    },
    xAxis: {
      categories: [
        '<span class="hc-cat-title">Meta mensal</span><br/>',
        '<span class="hc-cat-title">Meta Anual</span><br/>',
      ],
    },
    plotOptions: {
      series: {
        pointPadding: 0.25,
        borderWidth: 0,
        color: "#1976d2",
        targetOptions: {
          color: "orange",
          width: "500%",
        },
      },
      bullet:{
        pointWidth: 20
      }
    },
    legend: {
      enabled: false,
    },
    yAxis: {
      gridLineWidth: 0,
      plotBands: [
        {
          from: 0,
          to: dados?.metasAnuais.target/3,
          
        },
        {
          from: dados?.metasAnuais.target/3,
          to: (dados?.metasAnuais.target/3)*2,
          
        },
        {
          from: (dados?.metasAnuais.target/3)*2,
          to: dados?.metasAnuais.target,
          
        },
        {
          from: dados?.metasAnuais.target,
          to: dados?.metasAnuais.target+1000,
          
        },
      ],
      title: null,
    },
    series: [
      {
        data: [
          dados?.metasMensais,
          dados?.metasAnuais
        ],
      },
    ],
    tooltip: {
      pointFormat: "<b>R$: {point.y}</b> (meta de R$: {point.target})",
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export default DashboarMetasVendas;

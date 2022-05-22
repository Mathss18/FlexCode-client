import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import brazilMap from "../../constants/brazil";
import { useEffect, useState } from "react";
// Load Highcharts modules
require("highcharts/modules/map")(Highcharts);

var initialValues = [
  ["br-sp", 0],
  ["br-ma", 0],
  ["br-pa", 0],
  ["br-sc", 0],
  ["br-ba", 0],
  ["br-ap", 0],
  ["br-ms", 0],
  ["br-mg", 0],
  ["br-go", 0],
  ["br-rs", 0],
  ["br-to", 0],
  ["br-pi", 0],
  ["br-al", 0],
  ["br-pb", 0],
  ["br-ce", 0],
  ["br-se", 0],
  ["br-rr", 0],
  ["br-pe", 0],
  ["br-pr", 0],
  ["br-es", 0],
  ["br-rj", 0],
  ["br-rn", 0],
  ["br-am", 0],
  ["br-mt", 0],
  ["br-df", 0],
  ["br-ac", 0],
  ["br-ro", 0],
];

function DashboardMap({dados}) {
  const [estados, setEstados] = useState(initialValues)

  useEffect(() => {
    if(!dados) return;

    var aux = estados;
    estados.forEach((item,index)=>{
      dados?.vendasPorEstado.forEach((elem,i)=>{
        if(item[0] === elem[0]){
          aux[index][1] = elem[1]
        }
      })
    })
    setEstados(aux)
  }, [dados]);


  const mapOptions = {
    title: {
      text: "Mapa de vendas "+new Date().getFullYear(),
    },
    subtitle: {
      text: 'Por estado',
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },
    colorAxis: {
      min: 0,
      minColor: "##FFF0F0",
      maxColor: "#CF1717",
      stops: [
        [0, "#FFF0F0"],
        [0.50, "#FB6A6A"],
        [1, "#CF1717"],
      ],
    },

    series: [
      {
        mapData: brazilMap,
        data: estados,
        name: "Brasil",
        states: {
          hover: {
            color: "#BADA55",
          },
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    ],
  };

  return (
    <HighchartsReact
      options={mapOptions}
      constructorType={"mapChart"}
      highcharts={Highcharts}
    />
  );
}

export default DashboardMap;

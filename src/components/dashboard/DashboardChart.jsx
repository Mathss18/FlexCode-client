import { Bar } from "react-chartjs-2";
import { randomHexColor } from "../../utils/functions";

function DashboardChart({ contasBancarias }) {
  const data = {
    labels: contasBancarias.map((item) => {
      return item.nome;
    }),

    datasets: [
      {
        categoryPercentage: 0.5,
        barPercentage: 0.5,
        label: "Saldo atual",
        data: contasBancarias.map((item) => {
          return item.saldo.toFixed(2);
        }),
        backgroundColor: contasBancarias.map((item) => {
          return randomColor();
        }),
        borderColor: ["#000000"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Saldo das contas bancarias",
        font: {
          size: 24,
        },
      },
    },
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  function randomColor() {
    const colors = [
      "#3FC1C0",
      "#20BAC5",
      "#00B2CA",
      "#04A6C2",
      "#0899BA",
      "#0F80AA",
      "#16679A",
      "#1A5B92",
      "#1C558E",
      "#1D4E89",
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
}

export default DashboardChart;

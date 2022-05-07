import { Bar } from 'react-chartjs-2';

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Orange', 'Orange', 'Orange'],

    datasets: [{
        categoryPercentage: 0.5,
        barPercentage: 0.8,
        label: '# of Votos',
        data: [12, 19, 3, 5, 2, 3, 3, 3, 3],
        backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: [
            'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1
    }]
}

const options = {
    maintainAspectRatio: true,
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
        },
    },
}

function DashboardChart(){
    return(
        <Bar data={data} options={options} height={150} />
    );
}

export default DashboardChart;
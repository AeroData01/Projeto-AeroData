window.onload = function () {
    gerarGraficoTempoMedio();
    gerarGraficoAtrasosPorRota();
    gerarGraficoCancelamentosPorRota();
    gerarGraficoAtrasosPorCompanhia();
}

function gerarGraficoTempoMedio() {
    // Gráfico de Barras Horizontal - Tempo Médio de Atrasos
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;
    fetch(`../voos/listarMediaAtrasoPorCompanhia/${nome_fantasia}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        response.json().then(json => {
            let data_2023 = Number(json[0].tempo_medio_atraso_minutos);
            let data_2024 = Number(json[1].tempo_medio_atraso_minutos);

            let dataset = {
                label: 'Tempo médio de atraso (min)',
                data: [data_2023, data_2024],
                backgroundColor: ['#93C5FD', '#3B82F6'], // cores diferentes para cada barra, opcional
                borderRadius: 6
            };

            new Chart(document.getElementById('lineChartAtrasos'), {
                type: 'bar',
                data: {
                    labels: ["2023", "2024"],
                    datasets: [dataset]
                },
                options: {
                    indexAxis: 'x',
                    responsive: false,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Tempo Médio de Atrasos 2023/24',
                            font: { size: 18, weight: 'bold' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { beginAtZero: true, max: 100 }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        })
    })
}

function gerarGraficoAtrasosPorRota() {
    // Atrasos por Rota
    new Chart(document.getElementById('donutChart'), {
        type: 'line',
        data: {
            labels: ['GRU-SDU', 'GRU-GIG', 'CGH-SDU', 'CGH-GIG', 'SDU-CGH', 'SDU-GRU', 'GIG-GRU', 'GIG-CGH'],
            datasets: [
                {
                    label: 'Gol',
                    data: [180, 70, 700, 65, 500, 90, 110, 50],
                    borderColor: '#FFCC00',
                    backgroundColor: '#FFCC00',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Azul',
                    data: [100, 45, 320, 30, 280, 50, 90, 20],
                    borderColor: '#00ADEF',
                    backgroundColor: '#00ADEF',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Latam',
                    data: [98, 33, 424, 32, 428, 29, 58, 17],
                    borderColor: '#CC092F',
                    backgroundColor: '#CC092F',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Atrasos por Rota ',
                    font: { size: 18, weight: 'bold' }
                },
                legend: {
                    position: 'bottom',
                    onClick: Chart.defaults.plugins.legend.onClick
                }
            }
        }
    });
}

function gerarGraficoCancelamentosPorRota() {
    // Cancelamentos por Rota
    new Chart(document.getElementById('lineChartCancelamentos'), {
        type: 'line',
        data: {
            labels: ['GRU-SDU', 'GRU-GIG', 'CGH-SDU', 'CGH-GIG', 'SDU-CGH', 'SDU-GRU', 'GIG-GRU', 'GIG-CGH'],
            datasets: [
                {
                    label: 'Gol',
                    data: [25, 20, 458, 22, 506, 30, 18, 16],
                    borderColor: '#FFCC00',
                    borderWidth: 5,
                    backgroundColor: '#FFCC00',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Azul',
                    data: [10, 8, 150, 7, 160, 12, 15, 9],
                    borderColor: '#00ADEF',
                    backgroundColor: '#00ADEF',
                    borderWidth: 5,
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Latam',
                    data: [10, 15, 350, 16, 340, 14, 10, 15],
                    borderColor: '#CC092F',
                    borderWidth: 5,
                    backgroundColor: '#CC092F',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,

                    text: 'Cancelamentos por Rota ',
                    font: { size: 27, weight: 'bold' }
                },
                legend: {
                    position: 'bottom',
                    onClick: Chart.defaults.plugins.legend.onClick
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 20 // ou 16, 18 etc.
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }

    });

}

function gerarGraficoAtrasosPorCompanhia() {
    // Atrasos por Companhia
    new Chart(document.getElementById('barChartCompanhias'), {
        type: 'bar',
        data: {
            labels: ['Azul', 'Gol', 'Latam'],
            datasets: [{
                label: 'Atrasos (%)',
                data: [11.2, 14.8, 19.4],
                backgroundColor: ['#00ADEF', '#FFCC00', '#CC092F']
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Atrasos por Companhia Aérea - 2024',
                    font: { size: 18, weight: 'bold' }
                },
                legend: { display: false }
            }
        }
    });
}
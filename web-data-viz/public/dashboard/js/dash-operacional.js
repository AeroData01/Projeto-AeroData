window.onload = function () {
    gerarGraficoTempoMedio();
    gerarGraficoAtrasosPorRota();
    gerarGraficoCancelamentosPorRota();
    gerarGraficoAtrasosPorCompanhia();
    carregarKpis();
}

function carregarKpis() {
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;
    fetch(`/voos/listarKpisOperacional/${nome_fantasia}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        response.json().then(json => {
            var maior_cancelamento_aeroporto = json[0];
            var maior_atraso_aeroporto = json[1];
            var maior_atraso_rota = json[2];
            var maior_cancelamento_rota = json[3];
            var eficiencia_companhia = json[4];

            document.getElementById("nome_rota_mais_atraso").innerHTML = maior_atraso_rota.nome;
            document.getElementById("total_rota_mais_atraso").innerHTML = maior_atraso_rota.total;
            document.getElementById("nome_rota_mais_cancelamento").innerHTML = maior_cancelamento_rota.nome;
            document.getElementById("total_rota_mais_cancelamento").innerHTML = maior_cancelamento_rota.total;
            document.getElementById("nome_aeroporto_mais_atraso").innerHTML = maior_atraso_aeroporto.nome;
            document.getElementById("total_aeroporto_mais_atraso").innerHTML = maior_atraso_aeroporto.total;
            document.getElementById("nome_aeroporto_mais_cancelamento").innerHTML = maior_cancelamento_aeroporto.nome;
            document.getElementById("total_aeroporto_mais_cancelamento").innerHTML = maior_cancelamento_aeroporto.total;
            document.getElementById("pontualidade_companhia").innerHTML = eficiencia_companhia.nome;

        })
    })
}

function gerarGraficoTempoMedio() {
    // Gráfico de Barras Horizontal - Tempo Médio de Atrasos
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;
    fetch(`/voos/listarMediaAtrasoPorCompanhia/${nome_fantasia}`, {
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
                            text: 'Tempo Médio de Atrasos - 2023/24',
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
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;
    fetch(`/voos/listarRotasComMaisAtraso/${nome_fantasia}`, {
        method: "GET"
    }).then(response => {
        response.json().then(json => {
            var rotas = json.map(j => `${j.rota} - ${j.ano}`);
            var atrasos = json.map(j => j.total_atrasos);

            new Chart(document.getElementById('donutChart'), {
                type: 'bar',
                data: {
                    labels: rotas,
                    datasets: [
                        {
                            label: nome_fantasia,
                            data: atrasos,
                            borderColor: '#FFCC00',
                            backgroundColor: '#FFCC00'
                        }
                    ]
                },
                options: {
                    responsive: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: Math.max(...atrasos) + 10
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Total de atrasos por Rota - 2023/2024',
                            font: { size: 18, weight: 'bold' }
                        },
                        legend: {
                            position: 'bottom',
                            onClick: Chart.defaults.plugins.legend.onClick
                        }
                    }
                }
            })
        })
    })
}

function gerarGraficoCancelamentosPorRota() {
    // Cancelamentos por Rota
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;
    fetch(`/voos/listarRotasComMaisCancelamentos/${nome_fantasia}`, {
        method: "GET"
    }).then(response => {
        response.json().then(json => {
            var rotas = json.map(j => `${j.rota} - ${j.ano}`);
            var cancelamentos = json.map(j => j.total_cancelamentos);
            new Chart(document.getElementById('lineChartCancelamentos'), {
                type: 'bar',
                data: {
                    labels: rotas,
                    datasets: [
                        {
                            label: nome_fantasia,
                            data: cancelamentos,
                            borderColor: '#FFCC00',
                            backgroundColor: '#FFCC00',
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Cancelamentos por Rota ',
                        },
                        legend: {
                            position: 'bottom',
                            onClick: Chart.defaults.plugins.legend.onClick
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: Math.max(...cancelamentos) + 10
                        }
                    }
                }
            })
        })
    });
}

function gerarGraficoAtrasosPorCompanhia() {
    // Atrasos por Companhia
    // Cancelamentos por Rota
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;
    fetch(`/voos/listarAeroportosComMaisAtrasosECancelamentos/${nome_fantasia}`, {
        method: "GET"
    }).then(response => {
        response.json().then(json => {
            var aeroportos = json.map(j => j.aeroporto);
            var atrasos = json.map(j => j.total_atrasos);
            var cancelamentos = json.map(j => j.total_cancelamentos);

            var labels = aeroportos;
            var datasets = [
                {
                    label: 'Atrasos',
                    data: atrasos,
                    backgroundColor: '#00ADEF'
                },
                {
                    label: 'Cancelamentos',
                    data: cancelamentos,
                    backgroundColor: '#FFCC00'
                }
            ];

            new Chart(document.getElementById('barChartCompanhias'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Aeroportos com mais cancelamentos e atrasos 2023 + 2024  ',
                            font: { size: 18, weight: 'bold' }
                        },
                        legend: { display: false }
                    }
                }
            })
        })
    });
}

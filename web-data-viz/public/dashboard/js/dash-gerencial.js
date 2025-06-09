window.onload = function () {
    carregarKpis();
    gerarGraficoAtrasoMedio();
    gerarGraficoCancelamentosMensais();
    gerarGraficoAtrasosMensais();
    // gerarGraficoComparativoDeVoos();
    gerarGraficoDistribuicaoCompanhias();
};

function carregarKpis() {
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;
    fetch(`../voos/listarKpisGerencial/${nome_fantasia}`, {
        method: "GET",
    }).then(function (resposta) {
        resposta.json().then(json => {
            console.log(json);
            document.getElementById('kpiTotalVoos').innerText = json[0].total_voos;
            document.getElementById('kpiTotalCancelados').innerText = `(${json[0].total_voos_cancelados})`;
            document.getElementById('kpiTotalAtrasos').innerText = `(${json[0].total_voos_atrasados})`;
            document.getElementById('kpiTaxaCancelamento').innerText = json[0].taxa_voos_cancelados_percentual + '%';
            document.getElementById('kpiTaxaAtraso').innerText = json[0].taxa_voos_atrasados_percentual + '%';
            document.getElementById('kpiRotaMaisAtrasos').innerText = json[0].rota_mais_atrasos;
            document.getElementById('kpiTotalAtrasosNaMaisAtrasada').innerText = `(${json[0].total_atrasos_na_rota_mais_atrasada})`;
        });
    });
}

function gerarGraficoAtrasoMedio() {
    // Gráfico 1 – Atraso médio
    fetch("../voos/listarTop3CompanhiasComMaisAtrasos", {
        method: "GET",
    }).then(function (resposta) {
        resposta.json().then(json => {
            let companhias = [];

            let dataset_2023 = {
                label: '2023',
                data: [],
                backgroundColor: '#1E40AF'
            };

            let dataset_2024 = {
                label: '2024',
                data: [],
                backgroundColor: '#60A5FA'
            };

            json.forEach(voo => {
                if (voo.ano == '2023') dataset_2023.data.push(voo.porcentagem_atrasos);
                else dataset_2024.data.push(voo.porcentagem_atrasos);

                if (!companhias.includes(voo.companhia)) companhias.push(voo.companhia);
            });

            new Chart(document.getElementById('chartAtrasoMedio'), {
                type: 'bar',
                data: {
                    labels: companhias,
                    datasets: [
                        dataset_2023,
                        dataset_2024
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Taxa de Atrasos por Companhia',
                            font: {
                                size: 19
                            }
                        },
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Taxa de Atrasos (%)'
                            }
                        }
                    }
                }
            });
        });
    }).catch(err => {
        console.error('Erro ao carregar dados de atraso médio:', err);
    });
}


// Gráfico 2 – Cancelamentos mensais
function gerarGraficoCancelamentosMensais() {
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;

    fetch(`../voos/listarCancelamentosMensais/${nome_fantasia}`, {
        method: "GET",
    }).then(function (resposta) {
        resposta.json().then(json => {
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

            let data_2023 = []
            let data_2024 = []

            for (i = 1; i <= 12; i++) {
                data_2023.push(0);
                data_2024.push(0);
            }

            json.forEach(voo => {
                if (voo.ano == '2023') data_2023[voo.mes - 1] = voo.total_voos_cancelados;
                else data_2024[voo.mes - 1] = voo.total_voos_cancelados;
            });

            let dataset_2023 = {
                label: '2023',
                data: data_2023,
                backgroundColor: 'purple'
            }

            let dataset_2024 = {
                label: '2024',
                data: data_2024,
                backgroundColor: 'pink'
            }

            new Chart(document.getElementById('chartCancelamentosMensais'), {
                type: 'line',
                data: {
                    labels: meses,
                    datasets: [
                        dataset_2023,
                        dataset_2024
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Cancelamentos por Mês na ${sessionStorage.COMPANHIA_USUARIO}`,
                            font: {
                                size: 19  
                            }
                        },
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Cancelamentos'
                            }
                        }
                    }
                }
            });
        });
    });
}


// Gráfico 3 – Atrasos mensais
function gerarGraficoAtrasosMensais() {
    var nome_fantasia = sessionStorage.COMPANHIA_USUARIO;

    fetch(`../voos/listarAtrasosMensais/${nome_fantasia}`, {
        method: "GET",
    }).then(function (resposta) {
        resposta.json().then(json => {
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

            let data_2023 = [];
            let data_2024 = [];

            for (let i = 1; i <= 12; i++) {
                data_2023.push(0);
                data_2024.push(0);
            }

            json.forEach(voo => {
                if (voo.ano == '2023') {
                    data_2023[voo.mes - 1] = voo.total_voos_atrasados;
                } else {
                    data_2024[voo.mes - 1] = voo.total_voos_atrasados;
                }
            });

            let dataset_2023 = {
                label: '2023',
                data: data_2023,
                backgroundColor: '#F59E0B'
            };

            let dataset_2024 = {
                label: '2024',
                data: data_2024,
                backgroundColor: '#3B82F6'
            };

            new Chart(document.getElementById('chartAtrasosMensais'), {
                type: 'line',
                data: {
                    labels: meses,
                    datasets: [
                        dataset_2023,
                        dataset_2024
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Atrasos por Mês na ${sessionStorage.COMPANHIA_USUARIO}`,
                            font: {
                                size: 19,               // tamanho da fonte em pixels
                                family: 'Arial, sans-serif', // opcional: família de fonte
                                weight: 'bold'         // opcional: peso da fonte
                            }
                        },
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Atrasos'
                            }
                        }
                    }
                }
            });
        });
    }).catch(err => {
        console.error('Erro ao carregar dados de atrasos mensais:', err);
    });
}


// Gráfico 4 – Rosca
function gerarGraficoDistribuicaoCompanhias() {

    fetch(`../voos/listarTotalVoosPorCompanhia`, {
        method: "GET",
    }).then(function (resposta) {
        resposta.json().then(json => {
            let companhias = [];
            let totalVoos = [];
            json.forEach(voo => {
                companhias.push(voo.companhia);
                totalVoos.push(voo.total_voos);
            });

            new Chart(document.getElementById('chartDistribuicaoCompanhias'), {
                type: 'doughnut',
                data: {
                    labels: companhias,
                    datasets: [{
                        data: totalVoos,
                        backgroundColor: ['#e31919', '#eb741a', '#050652'] 
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Quantidade de Voos por Companhia Aérea 2023/2024',
                            font: {
                                size: 19
                            }
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        });
    }).catch(err => {
        console.error('Erro ao carregar dados de distribuição de companhias:', err);
    });
}


function gerarGraficoComparativoDeVoos() {
    // Gráfico 5 – Comparativo de voos
    new Chart(document.getElementById('chartComparativo'), {
        type: 'line',
        data: {
            labels: ['Gol', 'Latam', 'Azul'],
            datasets: [
                {
                    label: 'Voos Cancelados',
                    data: [120, 150, 90],
                    borderColor: '#DC2626',
                    backgroundColor: '#DC2626',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Voos',
                    data: [1000, 1200, 1100],
                    borderColor: '#1E3A8A',
                    backgroundColor: '#1E3A8A',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Voos Atrasados',
                    data: [210, 250, 180],
                    borderColor: '#F59E0B',
                    backgroundColor: '#F59E0B',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Comparativo de Voos por Companhia' },
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Voos' } },
                x: { title: { display: true, text: 'Companhias' } }
            }
        }
    });
}

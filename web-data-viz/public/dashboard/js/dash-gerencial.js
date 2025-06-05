window.onload = function () {
    gerarGraficoAtrasoMedio();
    gerarGraficoCancelamentosMensais();
    gerarGraficoAtrasosMensais();
    gerarGraficoComparativoDeVoos();
    gerarGraficoDistribuicaoCompanhias();
};

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
            }

            let dataset_2024 = {
                label: '2024',
                data: [],
                backgroundColor: '#60A5FA'
            }

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
                        title: { display: true, text: 'Top 3 Companhias com Mais Atrasos (%) por Ano' },
                        legend: { position: 'top' }
                    },
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Taxa de Atrasos (%)' } }
                    }
                }
            });
        })
    })
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

            
            for(i = 1; i <= 12; i++) {
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
                backgroundColor: '#EF4444'
            }

            let dataset_2024 = {
                label: '2024',
                data: data_2024,
                backgroundColor: '#F87171'
            }
            
            new Chart(document.getElementById('chartCancelamentosMensais'), {
                type: 'bar',
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
                        title: { display: true, text: 'Cancelamentos por Mês - 2023 vs 2024' },
                        legend: { position: 'top' }
                    },
                    scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Cancelamentos' } }
                    }
                }
            });
        });
    })

}

// Gráfico 3 – Atrasos mensais
function gerarGraficoAtrasosMensais() {
    new Chart(document.getElementById('chartAtrasosMensais'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
                { label: '2023', data: [120, 130, 115, 140, 110, 100, 130, 125, 140, 150, 160, 170], backgroundColor: '#F59E0B' },
                { label: '2024', data: [110, 120, 105, 130, 100, 90, 120, 115, 130, 140, 150, 160], backgroundColor: '#FCD34D' }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Atrasos por Mês - 2023 vs 2024' },
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Atrasos' } }
            }
        }
    });
}

// Gráfico 4 – Rosca
function gerarGraficoDistribuicaoCompanhias() {

    new Chart(document.getElementById('chartDistribuicaoCompanhias'), {
        type: 'doughnut',
        data: {
            labels: ['Gol', 'Latam', 'Azul'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: ['#3B82F6', '#EF4444', '#10B981']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Participação no Mercado – SP-RJ' },
                legend: { position: 'bottom' }
            }
        }
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
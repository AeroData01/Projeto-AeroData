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
  // 1) pega valor de sessionStorage de forma segura
  const nomeFantasia = sessionStorage.getItem('COMPANHIA_USUARIO');
  if (!nomeFantasia) {
    console.error('Nome da companhia não definido em sessionStorage');
    return;
  }

  // 2) faz fetch e trata erros
  fetch(`/voos/listarMediaAtrasoPorCompanhia/${nomeFantasia}`, {
    method: 'GET'
  })
    .then(res => {
      if (!res.ok) throw new Error(`Erro na requisição (${res.status})`);
      return res.json();
    })
    .then(json => {
      // 3) extrai os dados de forma robusta
      const data2023 = Number(json.find(v => v.ano == '2023')?.tempo_medio_atraso_minutos ?? 0);
      const data2024 = Number(json.find(v => v.ano == '2024')?.tempo_medio_atraso_minutos ?? 0);

      // 4) registra plugin de datalabels
      Chart.register(ChartDataLabels);

      // 5) cria o gráfico com barras horizontais
      new Chart(
        document.getElementById('lineChartAtrasos').getContext('2d'),
        {
          type: 'bar',
          data: {
            labels: ['2023', '2024'],
            datasets: [{
              label: 'Tempo médio de atraso (min)',
              data: [data2023, data2024],
              backgroundColor: ['#93C5FD', '#3B82F6'],
              borderRadius: 6
            }]
          },
          options: {
            indexAxis: 'y',        // barras na horizontal
            responsive: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Tempo Médio de Atrasos – 2023/24',
                font: { size: 19 }
              },
              datalabels: {        // configurações do plugin
                anchor: 'end',
                align: 'right',
                formatter: v => v.toFixed(1)
              }
            },
            scales: {
              x: {                // eixo numérico agora é o X
                beginAtZero: true,
                max: 100
              }
            }
          }
        }
      );
    })
    .catch(err => console.error('Erro ao gerar gráfico:', err));
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
                            backgroundColor: '#1e1a8f'
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
                            font: { size: 19 }
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
                            borderColor: '#c7690c',
                            backgroundColor: '#c7690c',
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',
                    responsive: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Cancelamentos por Rota - 2023/2024',
                            font: {
                                size: 19
                            }
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
            });
        });
    }).catch(err => {
        console.error('Erro ao carregar dados de cancelamentos por rota:', err);
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
                    backgroundColor: '#FFCC00'
                },
                {
                    label: 'Cancelamentos',
                    data: cancelamentos,
                    backgroundColor: '#a81313'
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
                            text: 'Aeroportos com Mais Cancelamentos e Atrasos - 2023/2024  ',
                            font: { size: 19 }
                        },
                        legend: { display: false }
                    }
                }
            })
        })
    });
}

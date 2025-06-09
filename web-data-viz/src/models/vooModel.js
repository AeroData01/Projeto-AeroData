var database = require("../database/config");

// Top 3 companhias com mais atrasos por ano (2023, 2024)
function listarTop3CompanhiasComMaisAtrasos() {
    const instrucaoSql = `
    SELECT
        C.nome_fantasia AS companhia,
        YEAR(V.dia_referencia) AS ano,
        COUNT(CASE WHEN V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%' THEN 1 END) AS total_voos_atrasados,
        COUNT(*) AS total_voos,
        ROUND(COUNT(CASE WHEN V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%' THEN 1 END) * 100.0 / COUNT(*), 2) AS porcentagem_atrasos
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE YEAR(V.dia_referencia) IN (2023, 2024)
    GROUP BY C.nome_fantasia, YEAR(V.dia_referencia)
    HAVING total_voos > 0
    ORDER BY C.nome_fantasia, ano;`;
    return database.executar(instrucaoSql);
}

// Cancelamentos mensais por companhia e ano
function listarCancelamentosMensais(nome_fantasia) {
    const instrucaoSql = `
    SELECT
        C.nome_fantasia AS companhia,
        YEAR(V.dia_referencia) AS ano,
        MONTH(V.dia_referencia) AS mes,
        COUNT(*) AS total_voos_cancelados
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE V.situacao_voo = 'CANCELADO'
      AND C.nome_fantasia = '${nome_fantasia}'
    GROUP BY C.nome_fantasia, YEAR(V.dia_referencia), MONTH(V.dia_referencia)
    ORDER BY ano, mes, C.nome_fantasia;`;
    return database.executar(instrucaoSql);
}

// Atrasos mensais por companhia e ano
function listarAtrasosMensais(nome_fantasia) {
    const instrucaoSql = `
    SELECT
        C.nome_fantasia AS companhia,
        YEAR(V.dia_referencia) AS ano,
        MONTH(V.dia_referencia) AS mes,
        COUNT(*) AS total_voos_atrasados
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE (V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%')
      AND C.nome_fantasia = '${nome_fantasia}'
    GROUP BY C.nome_fantasia, YEAR(V.dia_referencia), MONTH(V.dia_referencia)
    ORDER BY ano, mes, C.nome_fantasia;`;
    return database.executar(instrucaoSql);
}

// Total de voos por companhia (participação de mercado)
function listarTotalVoosPorCompanhia() {
    const instrucaoSql = `
    SELECT
        C.nome_fantasia AS companhia,
        COUNT(*) AS total_voos
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    GROUP BY C.nome_fantasia
    ORDER BY total_voos DESC;`;
    return database.executar(instrucaoSql);
}

// Tempo médio de atraso por companhia (2023, 2024)
function listarMediaAtrasoPorCompanhia(nome_fantasia) {
    const instrucaoSql = `
    SELECT
        YEAR(V.dia_referencia) AS ano,
        C.sigla_companhia,
        C.nome_fantasia,
        ROUND(AVG(
          COALESCE(CASE WHEN V.situacao_partida LIKE 'Atraso <15%' THEN 10
                        WHEN V.situacao_partida LIKE 'Atraso 15-30%' THEN 22.5
                        WHEN V.situacao_partida LIKE 'Atraso 30-60%' THEN 45
                        WHEN V.situacao_partida LIKE 'Atraso >60%' THEN 75 END, 0)
          + COALESCE(CASE WHEN V.situacao_chegada LIKE 'Atraso <15%' THEN 10
                        WHEN V.situacao_chegada LIKE 'Atraso 15-30%' THEN 22.5
                        WHEN V.situacao_chegada LIKE 'Atraso 30-60%' THEN 45
                        WHEN V.situacao_chegada LIKE 'Atraso >60%' THEN 75 END, 0)
        ) / 2, 2) AS tempo_medio_atraso_minutos
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE YEAR(V.dia_referencia) IN (2023, 2024)
      AND (V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%')
      AND C.nome_fantasia = '${nome_fantasia}'
    GROUP BY YEAR(V.dia_referencia), C.sigla_companhia, C.nome_fantasia
    ORDER BY ano, tempo_medio_atraso_minutos DESC;`;
    return database.executar(instrucaoSql);
}

// KPIs gerenciais (totais, taxas e rota mais atrasos)
function listarKpisGerencial(nome_fantasia) {
    const instrucaoSql = `
    SELECT
      (SELECT COUNT(*)
       FROM Voos V
       JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
       WHERE C.nome_fantasia = '${nome_fantasia}') AS total_voos,

      ROUND(
        (SELECT COUNT(*)
         FROM Voos V
         JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
         WHERE (V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%')
           AND C.nome_fantasia = '${nome_fantasia}')
        * 100.0 /
        (SELECT COUNT(*)
         FROM Voos V
         JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
         WHERE C.nome_fantasia = '${nome_fantasia}'),
        2
      ) AS taxa_voos_atrasados_percentual,

      (SELECT COUNT(*)
       FROM Voos V
       JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
       WHERE (V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%')
         AND C.nome_fantasia = '${nome_fantasia}') AS total_voos_atrasados,

      ROUND(
        (SELECT COUNT(*)
         FROM Voos V
         JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
         WHERE V.situacao_voo = 'CANCELADO'
           AND C.nome_fantasia = '${nome_fantasia}')
        * 100.0 /
        (SELECT COUNT(*)
         FROM Voos V
         JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
         WHERE C.nome_fantasia = '${nome_fantasia}'),
        2
      ) AS taxa_voos_cancelados_percentual,

      (SELECT COUNT(*)
       FROM Voos V
       JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
       WHERE V.situacao_voo = 'CANCELADO'
         AND C.nome_fantasia = '${nome_fantasia}') AS total_voos_cancelados,

      (SELECT CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino)
       FROM Voos V
       JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
       WHERE (V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%')
         AND C.nome_fantasia = '${nome_fantasia}'
       GROUP BY sigla_aeroporto_partida, sigla_aeroporto_destino
       ORDER BY COUNT(*) DESC
       LIMIT 1) AS rota_mais_atrasos,

      (SELECT COUNT(*)
       FROM Voos V
       JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
       WHERE (V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%')
         AND C.nome_fantasia = '${nome_fantasia}'
         AND CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino) = (
           SELECT CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino)
           FROM Voos V2
           JOIN Companhia_Aerea C2 ON V2.fk_companhia = C2.sigla_companhia
           WHERE (V2.situacao_partida LIKE '
}]}

var database = require("../database/config");

function listarTop3CompanhiasComMaisAtrasos() {
    var instrucaoSql = `
    SELECT 
    C.nome_fantasia AS companhia,
    YEAR(V.dia_referencia) AS ano,

    COUNT(CASE 
        WHEN V.situacao_partida LIKE 'Atraso%' 
          OR V.situacao_chegada LIKE 'Atraso%' 
        THEN 1 
    END) AS total_voos_atrasados,

    COUNT(*) AS total_voos,

    ROUND(
        COUNT(CASE 
            WHEN V.situacao_partida LIKE 'Atraso%' 
              OR V.situacao_chegada LIKE 'Atraso%' 
            THEN 1 
        END) * 100.0 / COUNT(*), 
        2
    ) AS porcentagem_atrasos

        FROM Voos V
        JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
        WHERE YEAR(V.dia_referencia) IN (2023, 2024)
        GROUP BY C.nome_fantasia, YEAR(V.dia_referencia)
        HAVING total_voos > 0
        ORDER BY companhia, ano;`;

    return database.executar(instrucaoSql);
}

function listarCancelamentosMensais(nome_fantasia) {
    var instrucaoSql = `
    SELECT 
    C.nome_fantasia AS companhia,
    YEAR(V.dia_referencia) AS ano,
    MONTH(V.dia_referencia) AS mes,
    COUNT(*) AS total_voos_cancelados
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE V.situacao_voo = 'CANCELADO' AND C.nome_fantasia = '${nome_fantasia}'
    GROUP BY C.nome_fantasia, YEAR(V.dia_referencia), MONTH(V.dia_referencia)
    ORDER BY ano, mes, companhia;`;

    return database.executar(instrucaoSql);
}

function listarAtrasosMensais(nome_fantasia) {
    var instrucaoSql = `
    SELECT 
    C.nome_fantasia AS companhia,
    YEAR(V.dia_referencia) AS ano,
    MONTH(V.dia_referencia) AS mes,
    COUNT(*) AS total_voos_atrasados
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE V.situacao_partida LIKE 'Atraso%' AND C.nome_fantasia = '${nome_fantasia}' 
    OR V.situacao_chegada LIKE 'Atraso%'
    GROUP BY C.nome_fantasia, YEAR(V.dia_referencia), MONTH(V.dia_referencia)
    ORDER BY ano, mes, companhia;`;

    return database.executar(instrucaoSql);
}

function listarTotalVoosPorCompanhia() {
    var instrucaoSql = `
    SELECT 
    C.nome_fantasia AS companhia,
    COUNT(*) AS total_voos
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    GROUP BY C.nome_fantasia
    ORDER BY total_voos DESC;`;

    return database.executar(instrucaoSql);
}

function listarMediaAtrasoPorCompanhia(nome_fantasia) {
    var instrucaoSql = `
   SELECT 
    YEAR(v.dia_referencia) AS ano,
    c.sigla_companhia,
    c.nome_fantasia,
    ROUND(AVG(
        COALESCE(CASE 
            WHEN v.situacao_partida LIKE 'Atraso <15%' THEN 10
            WHEN v.situacao_partida LIKE 'Atraso 15-30%' THEN 22.5
            WHEN v.situacao_partida LIKE 'Atraso 30-60%' THEN 45
            WHEN v.situacao_partida LIKE 'Atraso >60%' THEN 75
        END, 0)
        +
        COALESCE(CASE 
            WHEN v.situacao_chegada LIKE 'Atraso <15%' THEN 10
            WHEN v.situacao_chegada LIKE 'Atraso 15-30%' THEN 22.5
            WHEN v.situacao_chegada LIKE 'Atraso 30-60%' THEN 45
            WHEN v.situacao_chegada LIKE 'Atraso >60%' THEN 75
        END, 0)
    ) / 2, 2) AS tempo_medio_atraso_minutos
    FROM Voos v
    JOIN Companhia_Aerea c ON v.fk_companhia = c.sigla_companhia
    WHERE YEAR(v.dia_referencia) IN (2023, 2024)
    AND (
        v.situacao_partida LIKE 'Atraso%' 
        OR v.situacao_chegada LIKE 'Atraso%'
    )
    AND c.nome_fantasia = '${nome_fantasia}'
    GROUP BY 
        YEAR(v.dia_referencia), 
        c.sigla_companhia, 
        c.nome_fantasia
    ORDER BY 
    ano,
    tempo_medio_atraso_minutos DESC;`;

    return database.executar(instrucaoSql);
}

function listarKpisGerencial(nome_fantasia) {
    var instrucaoSql = `
    SELECT
  (SELECT COUNT(*) FROM Voos) AS total_voos,

  ROUND((
    SELECT COUNT(*) 
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE (situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%') 
      AND C.nome_fantasia = '${nome_fantasia}'
  ) * 100.0 / (SELECT COUNT(*) FROM Voos), 2) AS taxa_voos_atrasados_percentual,

  (SELECT COUNT(*) 
   FROM Voos V
   JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
   WHERE (situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%') 
     AND C.nome_fantasia = '${nome_fantasia}'
  ) AS total_voos_atrasados,

  ROUND((
    SELECT COUNT(*) 
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE situacao_voo = 'Cancelado' 
      AND C.nome_fantasia = '${nome_fantasia}'
  ) * 100.0 / (SELECT COUNT(*) FROM Voos), 2) AS taxa_voos_cancelados_percentual,

  (SELECT COUNT(*) 
   FROM Voos V
   JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
   WHERE situacao_voo = 'Cancelado' 
     AND C.nome_fantasia = '${nome_fantasia}'
  ) AS total_voos_cancelados,

  (SELECT CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino)
   FROM Voos V
   JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
   WHERE (situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%') 
     AND C.nome_fantasia = '${nome_fantasia}'
   GROUP BY sigla_aeroporto_partida, sigla_aeroporto_destino
   ORDER BY COUNT(*) DESC
   LIMIT 1
  ) AS rota_mais_atrasos,

  (SELECT COUNT(*) 
   FROM Voos V
   JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
   WHERE (situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%')
     AND C.nome_fantasia = '${nome_fantasia}'
     AND CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino) = (
       SELECT CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino)
       FROM Voos V2
       JOIN Companhia_Aerea C2 ON V2.fk_companhia = C2.sigla_companhia
       WHERE (situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%')
         AND C2.nome_fantasia = '${nome_fantasia}'
       GROUP BY sigla_aeroporto_partida, sigla_aeroporto_destino
       ORDER BY COUNT(*) DESC
       LIMIT 1
     )
  ) AS total_atrasos_na_rota_mais_atrasada;
`;


    return database.executar(instrucaoSql);
}


module.exports = {
    listarTop3CompanhiasComMaisAtrasos,
    listarCancelamentosMensais,
    listarAtrasosMensais,
    listarTotalVoosPorCompanhia,
    listarKpisGerencial,
    listarMediaAtrasoPorCompanhia
};
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
    YEAR(V.dia_referencia) AS ano,
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
    FROM Voos V
    JOIN Companhia_Aerea c ON v.fk_companhia = c.sigla_companhia
    WHERE YEAR(V.dia_referencia) IN (2023, 2024)
    AND (
        v.situacao_partida LIKE 'Atraso%' 
        OR v.situacao_chegada LIKE 'Atraso%'
    )
    AND c.nome_fantasia = '${nome_fantasia}'
    GROUP BY 
        YEAR(V.dia_referencia), 
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
  (SELECT COUNT(*) FROM Voos V
  JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
   WHERE C.nome_fantasia = '${nome_fantasia}') AS total_voos,

  ROUND((
    SELECT COUNT(*) 
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE (situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%') 
      AND C.nome_fantasia = '${nome_fantasia}'
  ) * 100.0 / (
      SELECT COUNT(*) 
      FROM Voos V
      JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
      WHERE C.nome_fantasia = '${nome_fantasia}'
    ), 
    2) AS taxa_voos_atrasados_percentual,

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
  ) * 100.0 / (SELECT COUNT(*) 
      FROM Voos V
      JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
      WHERE C.nome_fantasia = '${nome_fantasia}'
    ), 
    2) AS taxa_voos_cancelados_percentual,

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

function listarRotasComMaisAtraso(nome_fantasia) {
  var instrucaoSql = `
  SELECT 
    CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino) AS rota,
    COUNT(*) AS total_atrasos,
    YEAR(V.dia_referencia) AS ano
   FROM Voos V
   JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
   WHERE (situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%') 
     AND C.nome_fantasia = '${nome_fantasia}'
   GROUP BY sigla_aeroporto_partida, sigla_aeroporto_destino, YEAR(V.dia_referencia) 
   ORDER BY COUNT(*) DESC;`

   return database.executar(instrucaoSql);
}

function listarRotasComMaisCancelamentos(nome_fantasia) {
  var instrucaoSql = `
  SELECT 
    CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino) AS rota,
    COUNT(*) AS total_cancelamentos,
    YEAR(V.dia_referencia) AS ano
   FROM Voos V
   JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
   WHERE situacao_voo = 'CANCELADO' 
     AND C.nome_fantasia = '${nome_fantasia}'
   GROUP BY sigla_aeroporto_partida, sigla_aeroporto_destino, YEAR(V.dia_referencia)
   ORDER BY COUNT(*) DESC`

   return database.executar(instrucaoSql);
}

function listarAeroportosComMaisAtrasosECancelamentos(nome_fantasia) {
  var instrucaoSql = `
  SELECT 
  aeroporto,
  SUM(total_atrasos) AS total_atrasos,
  SUM(total_cancelamentos) AS total_cancelamentos
  FROM (
  SELECT 
    V.sigla_aeroporto_partida AS aeroporto,
    CASE 
      WHEN situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%' THEN 1 ELSE 0 
    END AS total_atrasos,
    CASE 
      WHEN situacao_voo = 'CANCELADO' THEN 1 ELSE 0 
    END AS total_cancelamentos
  FROM Voos V
  JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
  WHERE C.nome_fantasia = '${nome_fantasia}'

  UNION ALL

  SELECT 
    V.sigla_aeroporto_destino AS aeroporto,
    CASE 
      WHEN situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%' THEN 1 ELSE 0 
    END AS total_atrasos,
    0 AS total_cancelamentos -- cancelamento só é relevante na partida
  FROM Voos V
  JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
  WHERE C.nome_fantasia = '${nome_fantasia}'
  ) AS rotas
  GROUP BY aeroporto
  ORDER BY (SUM(total_atrasos) + SUM(total_cancelamentos)) DESC;`;

   return database.executar(instrucaoSql);
}

function listarKpisOperacional(nome_fantasia) {
  var instrucaoSql = `
  WITH 
  voos_companhia AS (
    SELECT 
      COUNT(*) AS voos_realizados,
      SUM(CASE 
            WHEN situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%' 
            THEN 1 ELSE 0 
          END) AS voos_atrasados
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE C.nome_fantasia = '${nome_fantasia}'
      AND situacao_voo <> 'CANCELADO'
  ),
  cancelamentos_aeroporto AS (
    SELECT 
      V.sigla_aeroporto_partida AS nome,
      COUNT(*) AS total,
      'maior_cancelamento_aeroporto' AS tipo
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE C.nome_fantasia = '${nome_fantasia}'
      AND situacao_voo = 'CANCELADO'
    GROUP BY V.sigla_aeroporto_partida
    ORDER BY total DESC
    LIMIT 1
  ),
  atrasos_aeroporto AS (
    SELECT 
      aeroporto AS nome,
      SUM(total_atrasos) AS total,
      'maior_atraso_aeroporto' AS tipo
    FROM (
      SELECT V.sigla_aeroporto_partida AS aeroporto,
            CASE WHEN situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%' THEN 1 ELSE 0 END AS total_atrasos
      FROM Voos V
      JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
      WHERE C.nome_fantasia = '${nome_fantasia}'
      
      UNION ALL

      SELECT V.sigla_aeroporto_destino AS aeroporto,
            CASE WHEN situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%' THEN 1 ELSE 0 END AS total_atrasos
      FROM Voos V
      JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
      WHERE C.nome_fantasia = '${nome_fantasia}'
    ) AS atrasos
    GROUP BY aeroporto
    ORDER BY total DESC
    LIMIT 1
  ),
  atrasos_rota AS (
    SELECT 
      CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino) AS nome,
      COUNT(*) AS total,
      'maior_atraso_rota' AS tipo
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE C.nome_fantasia = '${nome_fantasia}'
      AND (situacao_partida LIKE 'Atraso%' OR situacao_chegada LIKE 'Atraso%')
    GROUP BY sigla_aeroporto_partida, sigla_aeroporto_destino
    ORDER BY total DESC
    LIMIT 1
  ),
  cancelamentos_rota AS (
    SELECT 
      CONCAT(sigla_aeroporto_partida, '-', sigla_aeroporto_destino) AS nome,
      COUNT(*) AS total,
      'maior_cancelamento_rota' AS tipo
    FROM Voos V
    JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
    WHERE C.nome_fantasia = '${nome_fantasia}'
      AND situacao_voo = 'CANCELADO'
    GROUP BY sigla_aeroporto_partida, sigla_aeroporto_destino
    ORDER BY total DESC
    LIMIT 1
  ),
  eficiencia AS (
    SELECT 
      CONCAT(ROUND((1 - voos_atrasados * 1.0 / voos_realizados) * 100, 2), '%') AS nome,
      NULL AS total,
      'eficiencia_da_companhia' AS tipo
    FROM voos_companhia
  )

  SELECT * FROM cancelamentos_aeroporto
  UNION ALL
  SELECT * FROM atrasos_aeroporto
  UNION ALL
  SELECT * FROM atrasos_rota
  UNION ALL
  SELECT * FROM cancelamentos_rota
  UNION ALL
  SELECT * FROM eficiencia;
  `;

  return database.executar(instrucaoSql);
}

module.exports = {
    listarTop3CompanhiasComMaisAtrasos,
    listarCancelamentosMensais,
    listarAtrasosMensais,
    listarTotalVoosPorCompanhia,
    listarKpisGerencial,
    listarKpisOperacional,
    listarMediaAtrasoPorCompanhia,
    listarRotasComMaisAtraso,
    listarRotasComMaisCancelamentos,
    listarAeroportosComMaisAtrasosECancelamentos
};

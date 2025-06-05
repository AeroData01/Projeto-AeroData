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

module.exports = {
    listarTop3CompanhiasComMaisAtrasos,
    listarCancelamentosMensais
};
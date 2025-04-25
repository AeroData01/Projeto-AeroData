package org.example.repository;

import org.example.repository.VooRepository;

import org.example.model.Voo;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

/**
 * Repositório responsável por operações de persistência para a entidade Voo.
 */
public class VooRepository {

    /**
     * Insere uma lista de voos no banco de dados.
     * @param conexao conexão ativa com o banco de dados
     * @param voos lista de voos a serem inseridos
     * @throws SQLException em caso de erro na operação
     */
    public void salvarVoos(Connection conexao, List<Voo> voos) throws SQLException {
        String sql = "INSERT INTO Voos (id_Voo, numero_voo, dia_referencia, aeroporto_partida, sigla_aeroporto_partida, aeroporto_destino, sigla_aeroporto_destino, situacao_voo, situacao_partida, situacao_chegada, fk_companhia) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, null)";

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            for (Voo voo : voos) {
                stmt.setString(1, voo.getNumeroVoo());
                stmt.setDate(2, new java.sql.Date(voo.getDataReferencia().getTime()));
                stmt.setString(3, voo.getSituacaoVoo());
                stmt.setString(4, voo.getSituacaoPartida());
                stmt.setString(5, voo.getSituacaoChegada());
                stmt.addBatch();
            }
            stmt.executeBatch();
        }
    }
}

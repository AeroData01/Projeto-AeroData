package sptech.school.repository;

import sptech.school.model.Voo;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

/**
 * Repositório responsável por operações de persistência para a entidade Voo,
 * utiliza batch e mostra debug dos valores que serão inseridos.
 */
public class VooRepository {

    /**
     * Insere uma lista de voos no banco de dados em batches, com commits manuais para performance.
     * Exibe debug dos parâmetros antes de cada batch.
     * @param conexao conexão ativa com o banco
     * @param voos lista de voos a inserir
     * @throws SQLException em caso de erro de banco
     */
    public void salvarVoos(Connection conexao, List<Voo> voos) throws SQLException {
        String sql =
            "INSERT INTO Voos (" +
            "numero_voo, dia_referencia, aeroporto_partida, sigla_aeroporto_partida, " +
            "aeroporto_destino, sigla_aeroporto_destino, situacao_voo, situacao_partida, situacao_chegada, fk_companhia) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        boolean originalAutoCommit = conexao.getAutoCommit();
        conexao.setAutoCommit(false);

        try (PreparedStatement stmt = conexao.prepareStatement(sql)) {
            final int BATCH_SIZE = 500;
            int count = 0;

            for (Voo v : voos) {

                // Popula o prepared statement
                stmt.setString(1, v.getNumeroVoo());
                stmt.setDate(2, v.getDataReferencia());
                stmt.setString(3, v.getAeroportoPartida());
                stmt.setString(4, v.getSiglaAeroportoPartida());
                stmt.setString(5, v.getAeroportoDestino());
                stmt.setString(6, v.getSiglaAeroportoDestino());
                stmt.setString(7, v.getSituacaoVoo());
                stmt.setString(8, v.getSituacaoPartida());
                stmt.setString(9, v.getSituacaoChegada());
                stmt.setString(10, v.getFkCompanhia()); 

                stmt.addBatch();
                count++;

                if (count % BATCH_SIZE == 0) {
                    stmt.executeBatch();
                    conexao.commit();
                }
            }

            // Executa e comita o restante
            if (count % BATCH_SIZE != 0) {
                stmt.executeBatch();
                conexao.commit();
            }
        } catch (SQLException e) {
            conexao.rollback();
            throw e;
        } finally {
            conexao.setAutoCommit(originalAutoCommit);
        }
    }
}

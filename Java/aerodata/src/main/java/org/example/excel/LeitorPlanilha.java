package org.example.excel;

import org.example.model.Voo;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Cell;


import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Date;


/**
 * Classe responsável por ler os dados da planilha Excel e convertê-los em objetos do tipo Voo.
 */
public class LeitorPlanilha {

    /**
     * Lê a planilha Excel (.xlsx) e retorna uma lista de voos.
     * @param caminhoArquivo caminho do arquivo Excel
     * @return lista de objetos Voo extraídos da planilha
     */
    public static List<Voo> lerVoos(String caminhoArquivo) {
        List<Voo> voos = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(caminhoArquivo);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // Pula a primeira linha que é o cabeçalho
            if (rowIterator.hasNext()) rowIterator.next();

            // Itera sobre as linhas da planilha
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Voo voo = new Voo();
                voo.setSiglaCompanhia(getString(row, 0));
                voo.setNomeCompanhia(getString(row, 1));
                voo.setNumeroVoo(getString(row, 2));
                voo.setAeroportoOrigem(getString(row, 8));
                voo.setAeroportoDestino(getString(row, 12));
                Cell cell = row.getCell(16);
                if (cell != null && cell.getCellType() == CellType.STRING) {  // Verifica se é STRING ou DATE
                    voo.setDataReferencia(cell.getDateCellValue());
                } else {
                    voo.setDataReferencia(new Date());  // Definindo data padrão
                }
                voo.setSituacaoVoo(getString(row, 15));
                voo.setSituacaoPartida(getString(row, 17));
                voo.setSituacaoChegada(getString(row, 18));
                voos.add(voo);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return voos;
    }

    /**
     * Recupera o valor textual de uma célula de uma linha.
     * @param row linha da planilha
     * @param index índice da célula
     * @return texto da célula ou string vazia caso seja nula
     */
    private static String getString(Row row, int index) {
        Cell cell = row.getCell(index);
        return cell != null ? cell.toString() : "";
    }
}

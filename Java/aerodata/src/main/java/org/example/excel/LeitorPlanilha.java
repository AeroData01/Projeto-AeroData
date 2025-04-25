package org.example.excel;

import org.example.model.Voo;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.DateUtil;
import org.example.model.Voo;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Classe responsável por ler e tratar a planilha de voos.
 */
public class LeitorPlanilha {

    /**
     * Lê a planilha Excel (.xlsx) e retorna uma lista de voos.
     * @param caminhoArquivo caminho do arquivo Excel
     * @return lista de objetos Voo extraídos da planilha
     */
    public static List<org.example.model.Voo> lerVoos(String caminhoArquivo) {
        List<org.example.model.Voo> voos = new ArrayList<>();
        try (FileInputStream fis = new FileInputStream(caminhoArquivo);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // Pula o cabeçalho
            if (rowIterator.hasNext()) rowIterator.next();

            // Itera sobre as linhas da planilha
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                org.example.model.Voo voo = new org.example.model.Voo();

                // Mapeia campos de texto
                voo.setSiglaCompanhia(getString(row, 0));
                voo.setNomeCompanhia(getString(row, 1));
                voo.setNumeroVoo(getString(row, 2));
                voo.setAeroportoPartida(getString(row, 8));
                voo.setAeroportoDestino(getString(row, 12));

                // Processa data na coluna 16
                Cell cell = row.getCell(16);
                if (cell != null && cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                    java.util.Date utilDate = cell.getDateCellValue();
                    voo.setDataReferencia(new java.sql.Date(utilDate.getTime()));
                } else {
                    // Fallback para data atual
                    voo.setDataReferencia(new java.sql.Date(System.currentTimeMillis()));
                }

                // Situações
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
     * Recupera o valor da célula como String, independentemente do tipo.
     */
    private static String getString(Row row, int index) {
        Cell cell = row.getCell(index);
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return cell.toString();
        }
    }
}

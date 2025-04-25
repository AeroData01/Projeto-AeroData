package org.example.excel;

import org.example.model.Voo;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.WorkbookFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Classe responsável por ler qualquer planilha (.xls ou .xlsx) e retornar lista de Voo.
 */
public class LeitorPlanilha {

    public static List<Voo> lerVoos(String caminhoArquivo) throws IOException, InvalidFormatException {
        List<Voo> voos = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(caminhoArquivo);
             Workbook workbook = WorkbookFactory.create(fis)) {   // Detecta HSSF ou XSSF

            Sheet sheet = workbook.getSheetAt(0);
            boolean primeiro = true;
            for (Row row : sheet) {
                if (primeiro) { primeiro = false; continue; }  // pula cabeçalho

                Voo voo = new Voo();
                voo.setSiglaCompanhia(getString(row, 0));
                voo.setNomeCompanhia(getString(row, 1));
                voo.setNumeroVoo(getString(row, 2));
                voo.setAeroportoPartida(getString(row, 8));
                voo.setSiglaAeroportoPartida(getString(row, 9));
                voo.setAeroportoDestino(getString(row, 12));
                voo.setSiglaAeroportoDestino(getString(row, 13));

                // data na coluna 16
                Cell cell = row.getCell(16);
                if (cell != null && cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                    java.util.Date utilDate = cell.getDateCellValue();
                    voo.setDataReferencia(new java.sql.Date(utilDate.getTime()));
                } else {
                    // fallback: data atual
                    voo.setDataReferencia(new java.sql.Date(System.currentTimeMillis()));
                }

                voo.setSituacaoVoo(getString(row, 15));
                voo.setSituacaoPartida(getString(row, 17));
                voo.setSituacaoChegada(getString(row, 18));
                voos.add(voo);
            }
        }

        return voos;
    }

    private static String getString(Row row, int idx) {
        Cell c = row.getCell(idx);
        if (c == null) return "";
        return switch (c.getCellType()) {
            case STRING  -> c.getStringCellValue();
            case NUMERIC -> String.valueOf(c.getNumericCellValue());
            case BOOLEAN -> String.valueOf(c.getBooleanCellValue());
            default      -> c.toString();
        };
    }
}

package sptech.school.excel;

import sptech.school.model.Voo;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.poifs.filesystem.FileMagic;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Classe responsável por ler qualquer planilha (.xls ou .xlsx) e retornar lista de Voo,
 * usando índices fixos de colunas conforme layout definido,
 * com debug mostrando apenas o primeiro voo lido.
 */
public class LeitorPlanilha {

    public static List<Voo> lerVoos(String caminhoArquivo) throws IOException {
        List<Voo> voos = new ArrayList<>();
        boolean printedFirst = false;

        try (InputStream fis = new FileInputStream(caminhoArquivo);
             InputStream is  = FileMagic.prepareToCheckMagic(fis)) {

            // Abre workbook conforme formato
            Workbook workbook = FileMagic.valueOf(is) == FileMagic.OOXML
                    ? new XSSFWorkbook(is)
                    : new HSSFWorkbook(is);

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            // Pula cabeçalho (linha 0)
            if (!rows.hasNext()) { workbook.close(); return voos; }
            rows.next();

            // Itera pelas linhas de dados
            while (rows.hasNext()) {
                Row row = rows.next();

                // Extrai campos usados
                String sigComp    = getString(row, 0);
                String nomeComp   = getString(row, 1);
                String numVoo     = getString(row, 2);
                String sigOrig    = getString(row, 3);
                String descOrig   = getString(row, 4);
                String sigDest    = getString(row, 5);
                String descDest   = getString(row, 6);
                String sitVoo     = getString(row, 7);
                java.sql.Date ref = dateFromCell(row.getCell(8));
                String sitPart   = getString(row, 9);
                String sitCheg   = getString(row,10);


                // Descartar linhas de filtro (origem==destino)
                if (descOrig.isBlank() || descDest.isBlank() || descOrig.equals(descDest)) {
                    continue;
                }

                // Popula objeto Voo
                Voo voo = new Voo();
                voo.setFkCompanhia(sigComp);
                voo.setNomeCompanhia(nomeComp);
                voo.setNumeroVoo(numVoo);
                voo.setSiglaAeroportoPartida(sigOrig);
                voo.setAeroportoPartida(descOrig);
                voo.setSiglaAeroportoDestino(sigDest);
                voo.setAeroportoDestino(descDest);
                voo.setSituacaoVoo(sitVoo);
                voo.setDataReferencia(ref);
                voo.setSituacaoPartida(sitPart);
                voo.setSituacaoChegada(sitCheg);
                voos.add(voo);
            }
            workbook.close();
        }
        return voos;
    }

    private static String getString(Row row, int idx) {
        Cell c = row.getCell(idx);
        if (c == null) return "";
        switch (c.getCellType()) {
            case STRING:  return c.getStringCellValue().trim();
            case NUMERIC: return String.valueOf(c.getNumericCellValue()).trim();
            case BOOLEAN: return String.valueOf(c.getBooleanCellValue()).trim();
            default:      return c.toString().trim();
        }
    }

    private static java.sql.Date dateFromCell(Cell c) {
        if (c != null
         && c.getCellType() == CellType.NUMERIC
         && DateUtil.isCellDateFormatted(c)) {
            return new java.sql.Date(c.getDateCellValue().getTime());
        }
        return new java.sql.Date(System.currentTimeMillis());
    }
}


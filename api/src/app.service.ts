import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as ExcelJS from 'exceljs';

@Injectable()
export class AppService {
  async convertDefontanaToExcel(htmlContent: string): Promise<Buffer> {
    // 1. Cargamos el HTML "engañoso" para poder manipularlo
    const $ = cheerio.load(htmlContent);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte Limpio');

    // Definimos las columnas que identificamos juntos
    worksheet.columns = [
      { header: 'Nro Orden', key: 'nroOrden', width: 20 },
      { header: 'Estado O/C', key: 'estado', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Descripción / Producto', key: 'descripcion', width: 50 },
      { header: 'U. Medida', key: 'um', width: 10 },
      { header: 'Precio Unitario', key: 'precio', width: 15 },
      { header: 'Cant. Ordenada', key: 'cantOrd', width: 15 },
      { header: 'Cant. Recibida', key: 'cantRec', width: 15 },
    ];

    let lastOrderNumber = '';
    let lastStatus = '';
    let lastDate = '';

    // 2. Buscamos todas las filas (tr) de la tabla
    $('tr').each((index, element) => {
      // Saltamos las primeras 7 filas de títulos como hicimos en Power Query
      if (index < 7) return;

      const cells = $(element).find('td');
      const firstCellText = $(cells[0]).text().trim();

      // 3. Lógica de Filtrado: Si la fila dice "Total:", la ignoramos
      if (firstCellText.startsWith('Total:')) return;

      // 4. Lógica de Fill Down:
      // Si la primera celda tiene datos, es una nueva orden.
      // Si está vacía, usamos los datos de la orden anterior.
      const currentOrder = firstCellText || lastOrderNumber;
      const currentStatus = $(cells[1]).text().trim() || lastStatus;
      const currentDate = $(cells[2]).text().trim() || lastDate;

      // Actualizamos las variables para la siguiente fila
      if (firstCellText) {
        lastOrderNumber = currentOrder;
        lastStatus = currentStatus;
        lastDate = currentDate;
      }

      // 5. Solo agregamos filas que tengan descripción de producto (celda 3 o 4)
      const descripcion = $(cells[3]).text().trim();
      if (descripcion && descripcion !== 'Detalle') {
        worksheet.addRow({
          nroOrden: currentOrder,
          estado: currentStatus,
          fecha: currentDate,
          descripcion: descripcion,
          um: $(cells[4]).text().trim(),
          precio: $(cells[5]).text().trim(),
          cantOrd: $(cells[8]).text().trim(), // Ajustamos índices según tu análisis
          cantRec: $(cells[9]).text().trim(),
        });
      }
    });

    // 6. Generamos el archivo final en memoria
    return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
  }
}

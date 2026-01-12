import ExcelJS from 'exceljs';
import { Context } from 'hono';

/**
 * Flattens a nested object into a single-level object with dot-notation keys.
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (
        typeof value === 'object' &&
        value !== null &&
        !(value instanceof Date) &&
        !Array.isArray(value)
      ) {
        Object.assign(result, flattenObject(value, propName));
      } else if (Array.isArray(value)) {
        result[propName] = JSON.stringify(value);
      } else if (value instanceof Date) {
        result[propName] = value.toISOString();
      } else {
        result[propName] = value;
      }
    }
  }

  return result;
}

/**
 * Converts an array of objects to an Excel buffer and sends it as a response.
 * @param c Hono Context
 * @param data Array of objects to export
 * @param filename Name of the file (without extension)
 */
export async function sendExcel(c: Context, data: any[], filename: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  if (data && data.length > 0) {
    // Flatten all items to ensure consistent headers
    const flattenedData = data.map((item) => flattenObject(item));

    // Extract all unique headers from all flattened objects
    const headerSet = new Set<string>();
    flattenedData.forEach((item) => {
      Object.keys(item).forEach((key) => headerSet.add(key));
    });
    const headers = Array.from(headerSet);

    worksheet.columns = headers.map((header) => ({
      header: header,
      key: header,
      width: Math.min(Math.max(header.length, 15), 50),
    }));

    // Add rows
    worksheet.addRows(flattenedData);

    // Make headers bold and add filter
    const firstRow = worksheet.getRow(1);
    firstRow.font = { bold: true };
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: headers.length },
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();

  c.header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  c.header('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

  return c.body(buffer as any);
}

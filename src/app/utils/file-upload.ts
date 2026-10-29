// File Upload and Validation Utilities for CSV and Excel files
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: any[][];
  defectiveData?: { defectives: number; sampleSize: number }[];
  fileName: string;
}

export interface UploadedFileInfo {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  rowCount: number;
  columnCount: number;
}

/**
 * Validate file structure for X-bar/R or X-bar/S charts
 * Expected format: Each row is a sample, each column is a measurement
 */
function validateVariableData(data: any[][], fileName: string): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!data || data.length === 0) {
    errors.push("File is empty or contains no data");
    return { isValid: false, errors, warnings, fileName };
  }

  // Check minimum samples
  if (data.length < 2) {
    errors.push("At least 2 samples are required");
  }

  // Check if all rows have the same length
  const firstRowLength = data[0].length;
  const inconsistentRows = data.filter((row, idx) => row.length !== firstRowLength);
  if (inconsistentRows.length > 0) {
    errors.push(`Inconsistent number of measurements per sample. All rows must have ${firstRowLength} values.`);
  }

  // Check if all values are numeric
  const nonNumericCells: string[] = [];
  data.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell === null || cell === undefined || cell === '') {
        errors.push(`Empty cell found at Row ${rowIdx + 1}, Column ${colIdx + 1}`);
      } else if (isNaN(Number(cell))) {
        nonNumericCells.push(`Row ${rowIdx + 1}, Column ${colIdx + 1}: "${cell}"`);
      }
    });
  });

  if (nonNumericCells.length > 0) {
    errors.push(`Non-numeric values found in: ${nonNumericCells.slice(0, 5).join("; ")}${nonNumericCells.length > 5 ? `... and ${nonNumericCells.length - 5} more` : ""}`);
  }

  // Warnings
  if (data.length > 100) {
    warnings.push(`Large dataset detected (${data.length} samples). Processing may take longer.`);
  }

  if (firstRowLength < 2) {
    warnings.push("Sample size is very small (< 2). Consider increasing sample size for better statistical power.");
  }

  if (firstRowLength > 25) {
    warnings.push("Sample size is very large (> 25). Ensure this is intentional.");
  }

  // Convert to numbers
  const numericData = data.map(row => row.map(cell => Number(cell)));

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: numericData,
    fileName
  };
}

/**
 * Validate file structure for P charts
 * Expected format: Two columns - [defectives, sampleSize] or [sample, defectives, sampleSize]
 */
function validateAttributeData(data: any[][], fileName: string): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!data || data.length === 0) {
    errors.push("File is empty or contains no data");
    return { isValid: false, errors, warnings, fileName };
  }

  // Check column count (should be 2 or 3)
  const colCount = data[0].length;
  if (colCount < 2 || colCount > 3) {
    errors.push(`Invalid format for P chart. Expected 2 columns [defectives, sampleSize] or 3 columns [sample, defectives, sampleSize]`);
  }

  // Determine if first column is sample number
  const hasIdColumn = colCount === 3;
  const defectiveCol = hasIdColumn ? 1 : 0;
  const sampleSizeCol = hasIdColumn ? 2 : 1;

  // Check if all values are numeric
  const nonNumericCells: string[] = [];
  data.forEach((row, rowIdx) => {
    const defectives = row[defectiveCol];
    const sampleSize = row[sampleSizeCol];

    if (defectives === null || defectives === undefined || defectives === '') {
      errors.push(`Empty defectives value at Row ${rowIdx + 1}`);
    } else if (isNaN(Number(defectives))) {
      nonNumericCells.push(`Row ${rowIdx + 1}, Defectives: "${defectives}"`);
    }

    if (sampleSize === null || sampleSize === undefined || sampleSize === '') {
      errors.push(`Empty sample size at Row ${rowIdx + 1}`);
    } else if (isNaN(Number(sampleSize))) {
      nonNumericCells.push(`Row ${rowIdx + 1}, Sample Size: "${sampleSize}"`);
    }
  });

  if (nonNumericCells.length > 0) {
    errors.push(`Non-numeric values found: ${nonNumericCells.slice(0, 3).join("; ")}${nonNumericCells.length > 3 ? `... and ${nonNumericCells.length - 3} more` : ""}`);
  }

  // Validate logical constraints
  data.forEach((row, rowIdx) => {
    const defectives = Number(row[defectiveCol]);
    const sampleSize = Number(row[sampleSizeCol]);

    if (defectives < 0) {
      errors.push(`Negative defectives at Row ${rowIdx + 1}`);
    }

    if (sampleSize <= 0) {
      errors.push(`Invalid sample size at Row ${rowIdx + 1} (must be > 0)`);
    }

    if (defectives > sampleSize) {
      errors.push(`Defectives (${defectives}) cannot exceed sample size (${sampleSize}) at Row ${rowIdx + 1}`);
    }
  });

  // Convert to defective data format
  const defectiveData = data.map(row => ({
    defectives: Number(row[defectiveCol]),
    sampleSize: Number(row[sampleSizeCol])
  }));

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    defectiveData,
    fileName
  };
}

/**
 * Parse CSV file
 */
export function parseCSV(file: File, chartType: "variable" | "attribute"): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data.filter((row: any) => row.some((cell: any) => cell !== null && cell !== ''));

        if (chartType === "variable") {
          resolve(validateVariableData(data, file.name));
        } else {
          resolve(validateAttributeData(data, file.name));
        }
      },
      error: (error) => {
        resolve({
          isValid: false,
          errors: [`CSV parsing error: ${error.message}`],
          warnings: [],
          fileName: file.name
        });
      }
    });
  });
}

/**
 * Parse Excel file
 */
export function parseExcel(file: File, chartType: "variable" | "attribute"): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to array
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Filter empty rows
        const filteredData = jsonData.filter((row: any) =>
          row.some((cell: any) => cell !== null && cell !== undefined && cell !== '')
        );

        if (chartType === "variable") {
          resolve(validateVariableData(filteredData, file.name));
        } else {
          resolve(validateAttributeData(filteredData, file.name));
        }
      } catch (error) {
        resolve({
          isValid: false,
          errors: [`Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings: [],
          fileName: file.name
        });
      }
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        errors: ["Failed to read file"],
        warnings: [],
        fileName: file.name
      });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Validate and parse uploaded file
 */
export async function validateAndParseFile(
  file: File,
  chartType: "variable" | "attribute"
): Promise<FileValidationResult> {
  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (!fileExtension) {
    return {
      isValid: false,
      errors: ["Unable to determine file type"],
      warnings: [],
      fileName: file.name
    };
  }

  if (!["csv", "xlsx", "xls"].includes(fileExtension)) {
    return {
      isValid: false,
      errors: ["Invalid file type. Please upload CSV or Excel (.xlsx, .xls) files only"],
      warnings: [],
      fileName: file.name
    };
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      errors: ["File size exceeds 10MB limit"],
      warnings: [],
      fileName: file.name
    };
  }

  // Parse based on file type
  if (fileExtension === "csv") {
    return parseCSV(file, chartType);
  } else {
    return parseExcel(file, chartType);
  }
}

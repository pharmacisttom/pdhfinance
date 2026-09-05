'use client';

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck,
  RefreshCw,
  Eye,
  Trash2,
  Layers,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Info,
  ChevronDown,
  Building,
} from 'lucide-react';
import { EXCEL_TEMPLATES, generateExcelTemplate } from '@/lib/excel-templates';

interface ParsedRow {
  rowIndex: number;
  data: Record<string, any>;
  isValid: boolean;
  errors: string[];
}

export default function ImportPage() {
  const [selectedModule, setSelectedModule] = useState<string>('bank_statement');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccess, setImportSuccess] = useState<{ count: number; totalAmount: number } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTemplate = EXCEL_TEMPLATES[selectedModule];

  // Handle template download
  const handleDownloadTemplate = (templateId: string) => {
    generateExcelTemplate(templateId);
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Process and parse Excel file
  const processFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      alert('กรุณาอัปโหลดไฟล์ Excel (.xlsx, .xls) หรือ .csv เท่านั้น');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
    setIsProcessing(true);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        validateAndFormatRows(rawJson);
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel กรุณาตรวจสอบความถูกต้องของโครงสร้างไฟล์');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Validation engine
  const validateAndFormatRows = (rawRows: any[]) => {
    if (!currentTemplate) return;

    const validated: ParsedRow[] = rawRows.map((row, index) => {
      const errors: string[] = [];
      const normalizedData: Record<string, any> = {};

      // Match columns by header or key
      currentTemplate.columns.forEach((col) => {
        let value = row[col.header] ?? row[col.key];

        // Check required
        if (col.required && (value === undefined || value === null || String(value).trim() === '')) {
          errors.push(`ขาดฟิลด์จำเป็น: "${col.header}"`);
        }

        // Validate number
        if (col.type === 'number' && value !== undefined && value !== '') {
          const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
          if (isNaN(num)) {
            errors.push(`ช่อง "${col.header}" ต้องเป็นตัวเลข`);
          } else {
            value = num;
          }
        }

        normalizedData[col.key] = value;
      });

      return {
        rowIndex: index + 2, // 1-based + 1 header
        data: normalizedData,
        isValid: errors.length === 0,
        errors,
      };
    });

    setParsedRows(validated);
  };

  // Handle Commit Import
  const handleCommitImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert('ไม่มีรายการที่ผ่านการตรวจสอบ กรุณาแก้ไขข้อผิดพลาดในไฟล์ก่อนนำเข้า');
      return;
    }

    // Calculate total amount if amount field exists
    let total = 0;
    validRows.forEach((r) => {
      if (typeof r.data.amount === 'number') {
        total += r.data.amount;
      }
    });

    setImportSuccess({
      count: validRows.length,
      totalAmount: total,
    });
  };

  const handleReset = () => {
    setFileName(null);
    setFileSize(null);
    setParsedRows([]);
    setImportSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-[#1687E8]" />
            <span>ศูนย์นำเข้าข้อมูล Excel มาตรฐาน (Excel Import Center)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ดาวน์โหลดไฟล์แม่แบบมาตรฐาน นำเข้าข้อมูล ตรวจสอบความถูกต้องอัตโนมัติ และซิงค์เข้าสู่ระบบ
          </p>
        </div>

        <button
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs transition-colors"
        >
          <BookOpen className="w-4 h-4 text-[#1687E8]" />
          <span>{showGuide ? 'ซ่อนคู่มือการนำเข้า' : 'คู่มือการเตรียมไฟล์ Excel'}</span>
        </button>
      </div>

      {/* Guide Banner */}
      {showGuide && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 text-xs text-gray-700 space-y-3">
          <div className="flex items-center space-x-2 font-bold text-[#08294F] text-sm">
            <Info className="w-5 h-5 text-[#1687E8]" />
            <span>แนวทางปฏิบัติที่ดี (Best Practices) ในการนำเข้าไฟล์ Excel สู่ระบบ</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs">
              <div className="font-bold text-[#08294F] mb-1">1. ใช้แม่แบบมาตรฐาน</div>
              <p className="text-gray-600 leading-relaxed">
                ดาวน์โหลดไฟล์แม่แบบจากปุ่มด้านล่าง เพื่อให้คอลัมน์และหัวตารางตรงกับระบบ 100%
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs">
              <div className="font-bold text-[#08294F] mb-1">2. รูปแบบวันที่</div>
              <p className="text-gray-600 leading-relaxed">
                กรอกวันที่ในรูปแบบ <span className="font-mono font-semibold text-blue-700">YYYY-MM-DD</span> (เช่น 2024-09-01) หรือตั้ง Format วันที่ใน Excel
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs">
              <div className="font-bold text-[#08294F] mb-1">3. ช่องจำนวนเงิน</div>
              <p className="text-gray-600 leading-relaxed">
                ใส่ตัวเลขบวก ไม่มีสัญลักษณ์พิเศษ (เช่น ฿, $, %) เพื่อป้องกันความผิดพลาดของระบบคำนวณ
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs">
              <div className="font-bold text-[#08294F] mb-1">4. ตรวจสอบก่อนยืนยัน</div>
              <p className="text-gray-600 leading-relaxed">
                ระบบจะไฮไลต์แถวที่มีปัญหาด้วยแถบสีแดง สามารถตรวจและแก้ไขก่อนกดยืนยันได้ทันที
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Download Standard Templates Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
            <Download className="w-4 h-4 text-[#08A7A4]" />
            <span>1. เลือกและดาวน์โหลดไฟล์แม่แบบมาตรฐาน (.xlsx)</span>
          </h3>
          <span className="text-[11px] text-gray-500">
            พร้อมตัวอย่างข้อมูลโรงพยาบาลและคำอธิบายโครงสร้างฟิลด์
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(EXCEL_TEMPLATES).map((tmpl) => {
            const isSelected = selectedModule === tmpl.id;
            return (
              <div
                key={tmpl.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-[#1687E8] bg-blue-50/40 shadow-xs ring-1 ring-[#1687E8]/30'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#08294F]/10 text-[#08294F]">
                      {tmpl.id.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-xs text-[#08294F] mt-1.5 line-clamp-1">
                      {tmpl.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedModule(tmpl.id);
                      handleReset();
                    }}
                    className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-[#1687E8] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? 'เลือกใช้งานอยู่' : 'เลือกโมดูลนี้'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate(tmpl.id)}
                    className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลดแม่แบบ</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Drag & Drop Upload Zone */}
      <div className="card-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-[#1687E8]" />
            <span>2. อัปโหลดไฟล์ Excel เพื่อนำเข้าสู่: </span>
            <span className="text-[#1687E8] underline font-extrabold">{currentTemplate?.name}</span>
          </h3>
          {fileName && (
            <button
              onClick={handleReset}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center space-x-1 font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างไฟล์ที่เลือก</span>
            </button>
          )}
        </div>

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#1687E8] bg-blue-50/60 scale-[1.005]'
              : 'border-gray-300 hover:border-[#1687E8] bg-gray-50/50 hover:bg-blue-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-12 h-12 mx-auto rounded-full bg-blue-100/80 text-[#1687E8] flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="text-xs font-bold text-[#08294F]">
            ลากและวางไฟล์ Excel ที่นี่ หรือ <span className="text-[#1687E8] underline">คลิกเพื่อเลือกไฟล์จากคอมพิวเตอร์</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            รองรับรูปแบบ .xlsx, .xls และ .csv (แนะนำใช้ไฟล์ที่ดาวน์โหลดจากแม่แบบมาตรฐาน)
          </div>

          {fileName && (
            <div className="mt-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white border border-blue-200 shadow-xs text-xs font-semibold text-[#08294F]">
              <FileSpreadsheet className="w-4 h-4 text-[#1687E8]" />
              <span>{fileName}</span>
              <span className="text-gray-400">({fileSize})</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Validation Summary & Action */}
      {parsedRows.length > 0 && (
        <div className="card-soft p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>3. ผลการตรวจสอบความถูกต้องของข้อมูล (Data Validation)</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                ตรวจสอบ {parsedRows.length} รายการ | ผ่านเกณฑ์ {validCount} รายการ | พบข้อผิดพลาด {errorCount} รายการ
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCommitImport}
                disabled={validCount === 0}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  validCount > 0
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันนำเข้า {validCount} รายการสู่ระบบ</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {importSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-emerald-900">
                    นำเข้าข้อมูลสำเร็จสมบูรณ์ {importSuccess.count} รายการ!
                  </div>
                  {importSuccess.totalAmount > 0 && (
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      ยอดเงินรวมที่บันทึก: {importSuccess.totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-200 text-emerald-800">
                BATCH #{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>
          )}

          {/* Preview Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08294F] text-white">
                <tr>
                  <th className="py-2.5 px-3 text-center w-14">แถว</th>
                  <th className="py-2.5 px-3 text-center w-24">สถานะ</th>
                  {currentTemplate.columns.map((col) => (
                    <th key={col.key} className="py-2.5 px-3 whitespace-nowrap">
                      {col.header}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-left">ข้อความแจ้งเตือน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {parsedRows.map((row) => (
                  <tr
                    key={row.rowIndex}
                    className={`hover:bg-gray-50 transition-colors ${
                      !row.isValid ? 'bg-rose-50/40' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-500">
                      #{row.rowIndex}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {row.isValid ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ผ่าน</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3" />
                          <span>พบข้อผิดพลาด</span>
                        </span>
                      )}
                    </td>
                    {currentTemplate.columns.map((col) => {
                      const val = row.data[col.key];
                      const isNum = typeof val === 'number';
                      return (
                        <td
                          key={col.key}
                          className={`py-2.5 px-3 whitespace-nowrap ${
                            isNum ? 'text-right font-mono font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {isNum
                            ? val.toLocaleString('th-TH', { minimumFractionDigits: 2 })
                            : String(val || '-')}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-[11px] text-rose-600 font-medium">
                      {row.errors.length > 0 ? row.errors.join(', ') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

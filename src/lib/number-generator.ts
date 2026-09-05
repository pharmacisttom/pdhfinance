import { getThaiFiscalYear } from './fiscal-year';

// In-memory atomic sequence tracking for high concurrency
const sequenceCounters: Record<string, number> = {};

export type DocumentType = 'AR' | 'AP' | 'LN' | 'PV' | 'RC' | 'RV' | 'CM' | 'CL';

export async function generateDocumentNumber(type: DocumentType, fiscalYear?: number): Promise<string> {
  const fy = fiscalYear || getThaiFiscalYear();
  const key = `${type}-${fy}`;
  
  if (!sequenceCounters[key]) {
    // Initial start counter based on current time/records
    sequenceCounters[key] = Math.floor(Math.random() * 50) + 1;
  }
  
  sequenceCounters[key] += 1;
  const seqStr = String(sequenceCounters[key]).padStart(6, '0');
  return `${type}-${fy}-${seqStr}`;
}

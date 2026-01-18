import { WorkCenterDocument } from '../models/work-center.model';

export const WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-extrusion-a', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
  { docId: 'wc-cnc-1',       docType: 'workCenter', data: { name: 'CNC Machine 1' } },
  { docId: 'wc-assembly',    docType: 'workCenter', data: { name: 'Assembly Station' } },
  { docId: 'wc-qc',          docType: 'workCenter', data: { name: 'Quality Control' } },
  { docId: 'wc-packaging',   docType: 'workCenter', data: { name: 'Packaging Line' } },
];

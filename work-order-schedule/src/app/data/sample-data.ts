import { WorkCenterDocument } from '../models/work-center.model';
import {WorkOrder} from '../models/work-order.model';

export const MOCKED_WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-extrusion-a', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
  { docId: 'wc-cnc-1',       docType: 'workCenter', data: { name: 'CNC Machine 1' } },
  { docId: 'wc-assembly',    docType: 'workCenter', data: { name: 'Assembly Station' } },
  { docId: 'wc-qc',          docType: 'workCenter', data: { name: 'Quality Control' } },
  { docId: 'wc-packaging',   docType: 'workCenter', data: { name: 'Packaging Line' } },
];


export const MOCKED_WORK_ORDERS: WorkOrder[] = [
  {
    docId: 'WO-002',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-cnc-1',
        name: 'Reprogram CNC Machine',
        startDate: '2026-02-05',  
        endDate: '2026-03-28',
        status: 'in-progress'
    }
  },
  {
    docId: 'WO-003',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-extrusion-a',
        name: 'Inspect Conveyor Belt',
        startDate: '2025-12-03',
        endDate: '2026-01-13',
        status: 'completed'
    }
  },
  {
    docId: 'WO-004',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-packaging',
        name: 'Calibrate Weighing Scales',
        startDate: '2026-02-05',  
        endDate: '2026-03-20',
        status: 'open'
    }
  },
  {
    docId: 'WO-005',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-packaging',
        name: 'Lubricate Moving Parts',
        startDate: '2026-04-02',
        endDate: '2026-05-03',
        status: 'open'
    }
  },
  {
    docId: 'WO-006',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-assembly',
        name: 'Replace Worn Gears',
        startDate: '2026-02-10',
        endDate: '2026-03-17',
        status: 'blocked'
    }
  },
  {
    docId: 'WO-015',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-qc',
        name: 'Quality Check Batch #42',
        startDate: '2026-01-01',  
        endDate: '2026-01-25',
        status: 'completed'
    }
  }
];
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
  // Extrusion Line A
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
    docId: 'WO-007',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-extrusion-a',
        name: 'Replace Drive Motor',
        startDate: '2026-01-15',
        endDate: '2026-02-10',
        status: 'in-progress'
    }
  },

  // CNC Machine 1
  {
    docId: 'WO-002',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-cnc-1',
        name: 'Reprogram CNC Machine',
        startDate: '2026-01-05',  
        endDate: '2026-01-28',
        status: 'in-progress'
    }
  },
  {
    docId: 'WO-010',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-cnc-1',
        name: 'Replace Tool Holders',
        startDate: '2026-02-01',
        endDate: '2026-03-04',
        status: 'open'
    }
  },
  {
    docId: 'WO-012',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-cnc-1',
        name: 'Software Update',
        startDate: '2026-03-05',
        endDate: '2026-04-10',
        status: 'blocked'
    }
  },

  // Assembly Station
  {
    docId: 'WO-006',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-assembly',
        name: 'Replace Worn Gears',
        startDate: '2026-01-10',
        endDate: '2026-02-05',
        status: 'completed'
    }
  },
  {
    docId: 'WO-013',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-assembly',
        name: 'Install New Workbench',
        startDate: '2026-02-07',
        endDate: '2026-03-20',
        status: 'in-progress'
    }
  },
  // Quality Control
  {
    docId: 'WO-017',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-qc',
        name: 'Calibrate Measurement Tools',
        startDate: '2026-01-22',
        endDate: '2026-02-10',
        status: 'in-progress'
    }
  },
  {
    docId: 'WO-019',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-qc',
        name: 'Update QC Procedures',
        startDate: '2026-03-03',
        endDate: '2026-03-30',
        status: 'open'
    }
  },

  // Packaging Line
  {
    docId: 'WO-004',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-packaging',
        name: 'Calibrate Weighing Scales',
        startDate: '2026-01-05',  
        endDate: '2026-01-25',
        status: 'completed'
    }
  },
  {
    docId: 'WO-005',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-packaging',
        name: 'Lubricate Moving Parts',
        startDate: '2026-02-11',
        endDate: '2026-03-13',
        status: 'open'
    }
  },
  {
    docId: 'WO-022',
    docType: 'workOrder',
    data: {
        workCenterId: 'wc-packaging',
        name: 'Test Automated Sealer',
        startDate: '2026-03-20',
        endDate: '2026-04-05',
        status: 'blocked'
    }
  }
];
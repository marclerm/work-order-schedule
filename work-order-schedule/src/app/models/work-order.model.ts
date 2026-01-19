export type WorkOrderStatus = 'open' | 'in-progress' | 'completed' | 'blocked';

export interface WorkOrder {
    docId: string;
    docType: 'workOrder';
    data:{
        name: string;
        workCenterId: string;        
        startDate: string; // ISO date string
        endDate: string;   // ISO date string
        status: WorkOrderStatus;
    }
}
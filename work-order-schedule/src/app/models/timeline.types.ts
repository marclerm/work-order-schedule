export type Timescale = 'day' | 'week' | 'month';

export type WorkOrderStatus = 'open' | 'in-progress' | 'completed' | 'blocked';

export type PendingCreate = {
  workCenterId: string;
  startColIndex: number;
  endColIndex: number;
};
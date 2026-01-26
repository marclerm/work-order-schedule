export type Timescale = 'day' | 'week' | 'month';

export type WorkOrderStatus = 'open' | 'in-progress' | 'completed' | 'blocked';

export type PendingCreate = {
  workCenterId: string;
  startColIndex: number;
  endColIndex: number;
};

export interface FormInitialValue {
  name: string;
  status: WorkOrderStatus;
  start?: string;
  end?: string;
}

export interface ModalState {
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}
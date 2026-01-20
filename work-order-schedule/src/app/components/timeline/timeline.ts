import { CommonModule } from '@angular/common';
import { Component, computed, signal, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { TimescaleSelector } from '../timescale-selector/timescale-selector';
import { Timescale, PendingCreate } from '../../models/timeline.types';
import { MOCKED_WORK_CENTERS, MOCKED_WORK_ORDERS } from '../../data/sample-data';
import { buildColumnRanges, TimelineColumnRange } from '../../utils/timeline-range';
import { getTimelinePosition } from '../../utils/timeline-position';
import { WorkOrder } from '../../models/work-order.model';
import { WorkOrderForm } from '../work-order-form/work-order-form';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimescaleSelector, WorkOrderForm],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.scss'],
})
export class Timeline implements AfterViewInit {
  // Props
  timeScale = signal<Timescale>('month');
  workCenters = MOCKED_WORK_CENTERS;
  workOrders = signal(MOCKED_WORK_ORDERS);
  pendingCreate = signal<PendingCreate | null>(null);
  monthColumns = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  today = new Date();

  //hoveredWorkOrderId: string | null = null;
  openMenuWorkOrderId: string | null = null;
  selectedWorkCenterId: string | null = null;

  //Form memebers
  formOpen = signal(false);
  formMode = signal<'create' | 'edit'>('create');
  editingId = signal<string | null>(null);
  formInitial = signal<any>(null);


  // Elements
  @ViewChild('scrollElement', { static: true }) scrollElement!: ElementRef<HTMLDivElement>;

  //#region  Start columns build and width for Header and Rows
  columns = computed<TimelineColumnRange[]>(() => buildColumnRanges(this.timeScale()));
  columnWidthPx = computed<number>(() => {
    const t = this.timeScale();
    if(t === 'month') return 160;
    if(t === 'week') return 140;
    return 60; // day
  });
  //#endregion

  //#region Timescale Selector handling

  onTimeScaleChange(value: Timescale) {
    this.timeScale.set(value);
    // Scroll to current time indicator after timescale change
    // to display it in view to let the user know where they are
    queueMicrotask(() => this.scrollToCurrent());
  }

  trackByColumnKey(index: number, item: TimelineColumnRange) {
    return item.key;
  }
  //#endregion

  //#region Current time indicator handling
  currentColumnIndex = computed<number>(() => {
    const columns = this.columns();
    const todayFormatted = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
    return columns.findIndex(col => todayFormatted >= col.start && todayFormatted < col.end);
  });

  currentLineLeftPx = computed<number>(() => {
    const index = this.currentColumnIndex();
    if(index === -1) return 0;

    const cols = this.columns();
    const col = cols[index];
    const totalWidth = this.columnWidthPx();

    // this is a hack for now to adjust the line to start at the beginning of the month or week
    // I believe a style is causing some offset that I have not yet identified
    // for Day option it seems to work fine
    if (this.timeScale() === 'month') {
      return (index+1) * totalWidth;
    }
    if (this.timeScale() === 'week') {
      return (index) * totalWidth;
    }

    const start = col.start.getTime();
    const end = col.end.getTime();
    const todayTime = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).getTime();

    const fraction = (todayTime - start) / (end - start); // obtain fraction of the day within the column
    return Math.round(index * totalWidth + fraction * totalWidth); // calculate left position based on index and fraction
  });

  currentLabel = computed<string>(() => {
    const t = this.timeScale();
    if(t === 'month')  return 'Current month';
    if(t === 'week')   return 'Current week';
    return 'Today'; // day
  });

  private scrollToCurrent() {
    const elem = this.scrollElement.nativeElement;
    if(!elem) return;
    
    // get current left position
    const currentLeft = this.currentLineLeftPx();
    // calculate target scroll position to center the current time indicator
    // we offset by 35% of the element width to position it slightly left of center
    // this provides better context of upcoming timeline. I played a little and 35% felt better than 50%
    const target = Math.max(0, currentLeft - Math.round(elem.clientWidth * 0.35)); 
    // smooth scroll to target position this way the user sees the movement to current time indicator
    elem.scrollTo({ left: target, behavior: 'smooth' });
  }
  //#endregion

  //#region Work Order positioning

    workOrdesByCenter = computed(() => {
    const map = new Map<string, typeof MOCKED_WORK_ORDERS>();
    for(const wo of this.workOrders()) {
      const wcId = wo.data.workCenterId;
      if(!map.has(wcId)) {
        map.set(wcId, []);
      }
      map.get(wcId)!.push(wo);
    }
    return map;
  });

  getWorkOrdersBarsOf(workCenterId: string) {
    const cols = this.columns();
    const colWidth = this.columnWidthPx();
    const workOrders = this.workOrdesByCenter().get(workCenterId) || [];

    const bars = workOrders.map(wo => {
      const position = getTimelinePosition({
        columns: cols,
        colWidthPx: colWidth,
        startIso: wo.data.startDate,
        endIso: wo.data.endDate,
      });

      if(!position) 
        return null;

      return {wo, ...position};
    }).filter(bar => bar !== null) as Array<{wo: WorkOrder, leftPx: number, widthPx: number}>;

    return bars;
  }
  //#endregion

  //#region Lifecycle hooks
  ngAfterViewInit(): void {
    // Initial scroll to current time indicator
    queueMicrotask(() => this.scrollToCurrent());
  }
  //#endregion

  //#region Mouse and Menu handling

  toggleMenu(id: string, ev: MouseEvent){
    console.log("menu toggled, id: "+ id);
    ev.stopPropagation();
    ev.preventDefault();
    this.openMenuWorkOrderId = this.openMenuWorkOrderId === id ? null : id;
    
  }

  closeMenu(){
    this.openMenuWorkOrderId = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeMenu();
  }

  onMenuClick(ev: MouseEvent) {
    ev.stopPropagation(); // don’t close when clicking inside menu
  }

  onEdit(id: string, ev: MouseEvent) {
    ev.stopPropagation();
    
    const wo = this.workOrders().find(x=> x.docId === id);
    if(!wo)
      return;

    this.formMode.set('edit');
    this.editingId.set(id);

    this.selectedWorkCenterId = wo.data.workCenterId;

    this.formInitial.set({
      name: wo.data.name,
      status: wo.data.status,
      start: wo.data.startDate ?? wo.data.startDate,
      end: wo.data.endDate ?? wo.data.endDate,
    });
    this.formOpen.set(true);
    this.closeMenu();
  }

  openCreateDrawer(prefill?: any) {
    this.formMode.set('create');
    this.editingId.set(null);
    this.formInitial.set(prefill ?? { name: '', status: 'open' });
    this.formOpen.set(true);
  }

  onDelete(id: string, ev: MouseEvent) {
    ev.stopPropagation();
    
    const wo = this.workOrders().find(x => x.docId === id);
    if (!wo) return;

    const confirmed = confirm(`Are you sure you want to delete "${wo.data.name}"? This action cannot be undone.`);
    
    if (confirmed) {
      this.workOrders.set(this.workOrders().filter(w => w.docId !== id));
      console.log('Deleted work order:', id);
    }
    
    this.closeMenu();
  }

  onFormSubmit(v: { name: string; status: any; start?: string; end?: string }) {
    const mode = this.formMode();
    const editing = this.editingId();

    if (v.start && v.end && v.start > v.end) {
      alert('Start date must be before End date.');
      return;
    }

    const wcId = this.selectedWorkCenterId ?? this.workCenters[0]?.docId;

    const conflict = this.checkOverlap(
      wcId,
      v.start,
      v.end,
      mode === 'edit' ? editing ?? undefined : undefined
    );

    if (conflict) {
      alert(
        `Date conflict detected!\n\n` +
        `The selected dates overlap with:\n` +
        `"${conflict.data.name}"\n` +
        `(${conflict.data.startDate} to ${conflict.data.endDate})\n\n` +
        `Please adjust the dates to resolve the conflict.`
      );
      return;
    }

    if (mode === 'edit' && editing) {
      this.workOrders.set(this.workOrders().map(w =>
        w.docId === editing
          ? ({
              ...w,
              data: {
                ...w.data,
                name: v.name,
                status: v.status,
                startDate: v.start,
                endDate: v.end,
              },
            } as WorkOrder)
          : w
      ));
    } else {
      
      

      const newId = `WO-${Math.random().toString(16).slice(2, 6)}`;

      this.workOrders.set( [
        ...this.workOrders(),
        {
          docId: newId,
          docType: 'workOrder',
          data: {
            workCenterId: wcId,
            name: v.name,
            status: v.status,
            startDate: v.start ?? '',
            endDate: v.end ?? '',
          },
        } as WorkOrder,
      ]);
    }
    this.selectedWorkCenterId = null;
    this.formOpen.set(false);
  }

  checkOverlap(
    workCenterId: string,
    startDate?: string,
    endDate?: string,
    excludeId?: string
  ): WorkOrder | null {
    const workOrders = this.workOrders().filter(
      wo => wo.data.workCenterId === workCenterId && wo.docId !== excludeId
    );

    if(!startDate || ! endDate)
        return null;
      
    for (const wo of workOrders) {
      const existingStart = wo.data.startDate;
      const existingEnd = wo.data.endDate;

      if (startDate < existingEnd && endDate > existingStart) {
        return wo;
      }
    }

    return null; // No overlap found
  }



  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'open': 'Open',
      'in-progress': 'In progress',
      'completed': 'Complete',
      'blocked': 'Blocked'
    };
    return labels[status] || status;
  }
  //#endregion

  //#region Create work order
  private normalizeRange(a: number, b: number) {
    return a <= b ? { start: a, end: b } : { start: b, end: a };
  }

  cancelPendingCreate() {
    this.pendingCreate.set(null);
  }

  onEmptyCellClick(workCenterId: string, colIndex: number, ev: MouseEvent) {
    // close menu in case
    this.closeMenu?.();
    // avoid interfering with any other click handlers
    ev.stopPropagation();

    const existing = this.pendingCreate();

    if (!existing || existing.workCenterId !== workCenterId) {
      this.selectedWorkCenterId =workCenterId; 
      this.pendingCreate.set({
        workCenterId,
        startColIndex: colIndex,
        endColIndex: colIndex,
      });
      return;
    }

    const r = this.normalizeRange(existing.startColIndex, colIndex);
    this.pendingCreate.set({
      workCenterId,
      startColIndex: r.start,
      endColIndex: r.end,
    });

    this.openCreateFromPending();
  }

  pendingCreateLeftPx = computed(() => {
    const p = this.pendingCreate();
    if (!p) return 0;
    return p.startColIndex * this.columnWidthPx();
  });

  pendingCreateWidthPx = computed(() => {
    const p = this.pendingCreate();
    if (!p) return 0;
    const colWidth = this.columnWidthPx();
    const spanCols = p.endColIndex - p.startColIndex + 1;
    return spanCols * colWidth;
  });

  openCreateFromPending(ev?: MouseEvent) {
    ev?.stopPropagation();

    const p = this.pendingCreate();
    if (!p) return;

    const cols = this.columns();
    const startCol = cols[p.startColIndex];
    const endCol = cols[p.endColIndex];

    if (!startCol || !endCol) return;

    const startIso = this.toISODate(startCol.start);
    const endIso =this.toISODate(endCol.end);

    // Set selected work center for the new work order
    this.selectedWorkCenterId = p.workCenterId;

    // Open drawer in create mode with prefilled dates
    this.formMode.set('create');
    this.editingId.set(null);
    this.formInitial.set({
      name: '',
      status: 'open',
      start: startIso,
      end: endIso,
    });
    this.formOpen.set(true);

    this.pendingCreate.set(null);
  }

  toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }


 //#endregion
}
import { CommonModule } from '@angular/common';
import { Component, computed, signal, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { TimescaleSelector } from '../timescale-selector/timescale-selector';
import { Timescale } from '../../models/timeline.types';
import { MOCKED_WORK_CENTERS, MOCKED_WORK_ORDERS } from '../../data/sample-data';
import { buildColumnRanges, TimelineColumnRange } from '../../utils/timeline-range';
import { getTimelinePosition } from '../../utils/timeline-position';
import { WorkOrder } from '../../models/work-order.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimescaleSelector],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.scss'],
})
export class Timeline implements AfterViewInit {
  // Props
  timeScale = signal<Timescale>('month');
  workCenters = MOCKED_WORK_CENTERS;
  workOrders = MOCKED_WORK_ORDERS
  monthColumns = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  today = new Date();

  //hoveredWorkOrderId: string | null = null;
  openMenuWorkOrderId: string | null = null;

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
    for(const wo of this.workOrders) {
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
    console.log('Edit', id);
    this.closeMenu();
  }

  onDelete(id: string, ev: MouseEvent) {
    ev.stopPropagation();
    // TODO: confirm + remove
    console.log('Delete', id);
    this.closeMenu();
  }
  //#endregion
}
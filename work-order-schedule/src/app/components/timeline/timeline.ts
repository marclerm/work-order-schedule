import { CommonModule } from '@angular/common';
import { Component, computed, signal, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { TimescaleSelector } from '../timescale-selector/timescale-selector';
import { Timescale } from '../../models/timeline.types';
import { WORK_CENTERS } from '../../data/sample-data';
import { buildColumnRanges, TimelineColumnRange } from '../../utils/timeline-range';

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
  workCenters = WORK_CENTERS;
  monthColumns = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  today = new Date();

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

  //#region Lifecycle hooks
  ngAfterViewInit(): void {
    // Initial scroll to current time indicator
    queueMicrotask(() => this.scrollToCurrent());
  }
  //#endregion
}
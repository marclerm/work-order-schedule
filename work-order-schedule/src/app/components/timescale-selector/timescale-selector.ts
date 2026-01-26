import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Timescale } from '../../models/timeline.types';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timescale-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './timescale-selector.html',
  styleUrls: ['./timescale-selector.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TimescaleSelector {

  @Input() value: Timescale = 'month';
  @Output() valueChange = new EventEmitter<Timescale>();

  options: { label: string; value: Timescale }[] = [
    { label: 'Day',   value: 'day' },
    { label: 'Week',  value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  onChange(v: Timescale | null) {
    if (!v) return;
    this.value = v;
    this.valueChange.emit(v);
  }
}

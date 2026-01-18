import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TimescaleSelector } from '../timescale-selector/timescale-selector';
import { Timescale } from '../../models/timeline.types';
import { WORK_CENTERS } from '../../data/sample-data';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, TimescaleSelector],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.scss'],
})
export class Timeline {
  timeScale: Timescale = 'month';
  workCenters = WORK_CENTERS;
  monthColumns = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
}

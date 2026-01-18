import { Component, signal } from '@angular/core';
import { Timeline } from './components/timeline/timeline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Timeline],
  template: `<app-timeline></app-timeline>`,
})
export class App {
  protected readonly title = signal('work-order-schedule');
}

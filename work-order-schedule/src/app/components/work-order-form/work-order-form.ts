import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WorkOrderStatus } from '../../models/timeline.types';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-work-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbDatepickerModule
  ],
  templateUrl: './work-order-form.html',
  styleUrl: './work-order-form.scss',
})
export class WorkOrderForm {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';

  @Input() initialValue?: {
    name: string;
    status: WorkOrderStatus;
    start?: string;
    end?: string;
  }

  @Output() cancel = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<{
    name: string;
    status: WorkOrderStatus;
    start?: string;
    end?: string;
  }>();

  statusOptions = [
    {label: 'Open', value: 'open'},
    {label: 'In progres', value: 'in-progress'},
    {label: 'Completed', value: 'completed'},
    {label: 'Blocked', value: 'blocked'}
  ];

  form = new FormGroup({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    status: new FormControl<WorkOrderStatus>('open', { nonNullable: true, validators: [Validators.required] }),
    start: new FormControl<NgbDateStruct | null>(null),
    end: new FormControl<NgbDateStruct | null>(null),
  });

  ngOnChanges() {
    const v = this.initialValue;
    if(!v)
      return;

    this.form.patchValue({
      name: v.name ?? '',
      status: v.status ?? 'open',
      start: v.start ? this.isoToNgb(v.start) : null,
      end: v.end ? this.isoToNgb(v.end) : null,
    }, { emitEvent: false });
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, status, start, end } = this.form.getRawValue();

    this.submitForm.emit({
      name,
      status,
      start: start ? this.ngbToIso(start) : undefined,
      end: end ? this.ngbToIso(end) : undefined,
    });
  }

  //Helpers
  isoToNgb(iso: string): NgbDateStruct {
    const [y, m, d] = iso.split('-').map(Number);
    return { year: y, month: m, day: d };
  }

  ngbToIso(d: NgbDateStruct): string {
    const mm = String(d.month).padStart(2, '0');
    const dd = String(d.day).padStart(2, '0');
    return `${d.year}-${mm}-${dd}`;
  }
}


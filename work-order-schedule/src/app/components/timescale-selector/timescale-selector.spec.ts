import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimescaleSelector } from './timescale-selector';

describe('TimescaleSelector', () => {
  let component: TimescaleSelector;
  let fixture: ComponentFixture<TimescaleSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimescaleSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimescaleSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { OperationalDashboard } from './operational-dashboard';

describe('OperationalDashboard', () => {
  let component: OperationalDashboard;
  let fixture: ComponentFixture<OperationalDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationalDashboard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationalDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicModalComponent } from './dynamic-modal';

describe('DynamicModal', () => {
  let component: DynamicModalComponent;
  let fixture: ComponentFixture<DynamicModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

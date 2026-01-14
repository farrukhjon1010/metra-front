import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidDialog } from './paid-dialog';

describe('PaidDialog', () => {
  let component: PaidDialog;
  let fixture: ComponentFixture<PaidDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

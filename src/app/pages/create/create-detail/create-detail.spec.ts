import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDetail } from './create-detail';

describe('CreateDetail', () => {
  let component: CreateDetail;
  let fixture: ComponentFixture<CreateDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

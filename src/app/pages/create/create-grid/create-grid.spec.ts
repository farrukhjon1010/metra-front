import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGrid } from './create-grid';

describe('CreateGrid', () => {
  let component: CreateGrid;
  let fixture: ComponentFixture<CreateGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

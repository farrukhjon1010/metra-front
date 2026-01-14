import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovingQuality } from './improving-quality';

describe('ImprovingQuality', () => {
  let component: ImprovingQuality;
  let fixture: ComponentFixture<ImprovingQuality>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprovingQuality]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImprovingQuality);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

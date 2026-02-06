import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIdle } from './create-idle';

describe('CreateIdle', () => {
  let component: CreateIdle;
  let fixture: ComponentFixture<CreateIdle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIdle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIdle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

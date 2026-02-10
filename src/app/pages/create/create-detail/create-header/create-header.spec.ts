import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHeader } from './create-header';

describe('CreateHeader', () => {
  let component: CreateHeader;
  let fixture: ComponentFixture<CreateHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

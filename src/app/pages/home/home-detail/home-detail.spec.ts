import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDetail } from './home-detail';

describe('HomeDetail', () => {
  let component: HomeDetail;
  let fixture: ComponentFixture<HomeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

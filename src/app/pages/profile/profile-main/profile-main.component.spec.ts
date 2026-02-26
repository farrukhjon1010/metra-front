import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMainComponent } from './profile-main.component';

describe('ProfileMain', () => {
  let component: ProfileMainComponent;
  let fixture: ComponentFixture<ProfileMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMainComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAvatarComponent } from './add-avatar.component';

describe('AddAvatar', () => {
  let component: AddAvatarComponent;
  let fixture: ComponentFixture<AddAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAvatarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

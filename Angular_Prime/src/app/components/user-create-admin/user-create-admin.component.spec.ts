import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateAdminComponent } from './user-create-admin.component';

describe('UserCreateAdminComponent', () => {
  let component: UserCreateAdminComponent;
  let fixture: ComponentFixture<UserCreateAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCreateAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserCreateAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiRequestComponent } from './noti-request.component';

describe('NotiRequestComponent', () => {
  let component: NotiRequestComponent;
  let fixture: ComponentFixture<NotiRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotiRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotiRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

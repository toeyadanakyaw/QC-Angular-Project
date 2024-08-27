import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAnnounceComponent } from './request-announce.component';

describe('RequestAnnounceComponent', () => {
  let component: RequestAnnounceComponent;
  let fixture: ComponentFixture<RequestAnnounceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestAnnounceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestAnnounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

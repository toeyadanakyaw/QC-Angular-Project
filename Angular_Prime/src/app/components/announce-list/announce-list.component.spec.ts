import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceListComponent } from './announce-list.component';

describe('AnnounceListComponent', () => {
  let component: AnnounceListComponent;
  let fixture: ComponentFixture<AnnounceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnounceListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnnounceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

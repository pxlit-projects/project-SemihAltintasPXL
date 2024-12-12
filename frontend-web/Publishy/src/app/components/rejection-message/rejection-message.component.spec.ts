import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionMessageComponent } from './rejection-message.component';

describe('RejectionMessageComponent', () => {
  let component: RejectionMessageComponent;
  let fixture: ComponentFixture<RejectionMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectionMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

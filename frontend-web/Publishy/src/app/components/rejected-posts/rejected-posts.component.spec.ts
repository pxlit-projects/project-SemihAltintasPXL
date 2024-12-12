import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedPostsComponent } from './rejected-posts.component';

describe('RejectedPostsComponent', () => {
  let component: RejectedPostsComponent;
  let fixture: ComponentFixture<RejectedPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

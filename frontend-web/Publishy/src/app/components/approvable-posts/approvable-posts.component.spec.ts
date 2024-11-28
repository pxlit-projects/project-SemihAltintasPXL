import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovablePostsComponent } from './approvable-posts.component';

describe('ApprovablePostsComponent', () => {
  let component: ApprovablePostsComponent;
  let fixture: ComponentFixture<ApprovablePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovablePostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovablePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

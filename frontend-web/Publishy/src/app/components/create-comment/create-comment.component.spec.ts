import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CreateCommentComponent } from './create-comment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CreateCommentComponent', () => {
  let component: CreateCommentComponent;
  let fixture: ComponentFixture<CreateCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCommentComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 1 }
            }
          }
        },
        MatSnackBar
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the id from route params on init', () => {
    expect(component.id).toBe(1);  
  });
});

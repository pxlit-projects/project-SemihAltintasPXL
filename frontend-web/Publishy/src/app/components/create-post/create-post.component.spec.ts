import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { HttpClientModule } from '@angular/common/http';
import { PostService } from "../../services/post.service";
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        paramMap: of({})
      }
    };

    await TestBed.configureTestingModule({
      imports: [CreatePostComponent, HttpClientModule],
      providers: [
        PostService,
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

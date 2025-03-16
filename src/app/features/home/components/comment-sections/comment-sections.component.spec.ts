import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentSectionsComponent } from './comment-sections.component';

describe('CommentSectionsComponent', () => {
  let component: CommentSectionsComponent;
  let fixture: ComponentFixture<CommentSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentSectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

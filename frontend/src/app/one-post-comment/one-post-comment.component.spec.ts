import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnePostCommentComponent } from './one-post-comment.component';

describe('OnePostCommentComponent', () => {
  let component: OnePostCommentComponent;
  let fixture: ComponentFixture<OnePostCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnePostCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnePostCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

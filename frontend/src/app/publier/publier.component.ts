import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFileVideo, faImage } from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-publier',
  templateUrl: './publier.component.html',
  styleUrls: ['./publier.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PublierComponent implements OnInit, OnDestroy {
  faFileVideo = faFileVideo;
  faImage = faImage;
  image: File;
  public imageName: string;

  postForm: FormGroup;
  formSubscription = new Subscription();
  constructor(private postService: PostService,
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  onChange(event: any) {
    this.image = event.target.files[0];
    this.imageName = event.target.files[0].name;
  }

  initForm() {
    this.formSubscription = this.auth.subject.subscribe(
      user => {
        this.postForm = this.formBuilder.group({
          texte: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ0-9 \'\.\,]+$')]],
          date: [Date.now(), [Validators.required]],
          nbrLikes: [0, [Validators.required]],
          nbrCommentaires: [0, [Validators.required]],
          imageUrl: [this.image],
          createBy: [user, [Validators.required]],
          likeStatus: [false, [Validators.required]]
        });
      }
    );
  }

  onSubmitForm() {
    const formValue = this.postForm.value;
    const post = new Post(
      formValue['texte'],
      formValue['date'],
      formValue['nbrLikes'],
      formValue['nbrCommentaires'],
      formValue['imageUrl'],
      formValue['likeStatus'],
      formValue['createBy'],
    );
    const formData: any = new FormData();
    formData.append('image', this.image);
    formData.append('post', JSON.stringify(post));

    this.formSubscription.add(this.postService.newPost(formData).subscribe(
      () => {
        this.postService.postsSubject.next(true);
      }
    ));
    this.router.navigate(['/forum']);
  }
  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}


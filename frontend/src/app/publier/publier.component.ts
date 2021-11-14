import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFileVideo, faImage } from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { User } from '../models/user.model'
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-publier',
  templateUrl: './publier.component.html',
  styleUrls: ['./publier.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PublierComponent implements OnInit {
  faFileVideo = faFileVideo;
  faImage = faImage;
  image: File;
  public imageName: string;

  postForm: FormGroup;

  constructor(private postService: PostService,
    private router: Router,
    private formBuilder: FormBuilder,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.initForm()
  }

  onChange(event: any) {
    this.image = event.target.files[0];
    this.imageName = event.target.files[0].name;
  }

  initForm() {
    let min = 100000;
    let max = 1000000;
    const postId = Math.floor(Math.random() * (max - min)) + min;
    // let userName;
    //  let userId;
    let currentUser;
    this.auth.subject.subscribe(
      user => {
        currentUser = user;
      }
    );
    const getUser: any = localStorage.getItem('currentUser');
    const user = JSON.parse(getUser).user;
    const userId = user.userId;
    const userName = user.firstName;
    console.log(getUser);
    this.postForm = this.formBuilder.group({
      texte: ['', [Validators.required, Validators.minLength(6)]],
      date: [Date.now(), [Validators.required]],
      nbrLikes: [0, [Validators.required]],
      nbrCommentaires: [0, [Validators.required]],
      postId: [postId, [Validators.required]],
      imageUrl: [this.image],
      createBy: [currentUser, [Validators.required]],
      likeStatus: [false, [Validators.required]]
    });
  }

  onSubmitForm() {
    const formValue = this.postForm.value;
    const post = new Post(
      formValue['texte'],
      formValue['date'],
      formValue['nbrLikes'],
      formValue['nbrCommentaires'],
      formValue['postId'],
      formValue['imageUrl'],
      //   formValue['userName'],
      //   formValue['userId'],
      formValue['likeStatus'],
      formValue['createBy'],

    );
    const formData: any = new FormData();
    formData.append('image', this.image);
    formData.append('post', JSON.stringify(post));

    this.postService.newPost(formData).subscribe(
      val => {
        console.log(val);
        this.ngOnInit();
        this.router.navigate(['/forum']);
      },
    );

  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFileVideo, faImage } from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { User } from '../models/user.model'

@Component({
  selector: 'app-publier',
  templateUrl: './publier.component.html',
  styleUrls: ['./publier.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class PublierComponent implements OnInit {
  faFileVideo = faFileVideo;
  faImage = faImage;
  image: File;
  public imageName: string;

  postForm: FormGroup;

  constructor(private postService: PostService,
    private router: Router,
    private formBuilder: FormBuilder) { }

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
    const getUser: any = localStorage.getItem('user');
    const user = JSON.parse(getUser).user;
    const userId = user.userId;
    const userName = user.firstName;

    this.postForm = this.formBuilder.group({
      texte: ['', [Validators.required, Validators.minLength(6)]],
      date: [new Date(), [Validators.required]],
      like: [0, [Validators.required]],
      commentaire: [0, [Validators.required]],
      postId: [postId, [Validators.required]],
      userName: [userName, [Validators.required]],
      userId: [userId, [Validators.required]]
    });
  }

  onSubmitForm() {
    const formValue = this.postForm.value;
    const post = new Post(
      formValue['texte'],
      formValue['date'],
      formValue['like'],
      formValue['commentaire'],
      formValue['postId'],
      formValue['userName'],
      formValue['userId']
    );
    const formData: any = new FormData();
    formData.append('image', this.image);
    formData.append('post', JSON.stringify(post));

    this.postService.newPost(formData)
      .subscribe(
        val => {
          console.log(val);
        },
        error => {
          console.log('Erreur' + error)
        }
      );
  }
}

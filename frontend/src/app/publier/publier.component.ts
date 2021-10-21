import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, } from '@angular/forms';
import { Router } from '@angular/router';
import { faFileVideo, faImage } from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../services/post.service';

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

  constructor(private postService: PostService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onChange(event: any) {
    this.image = event.target.files[0];
    this.imageName = event.target.files[0].name;
  }

  onSubmit(form: NgForm) {
    const texte = form.value['texte'];
    let min = 1000000;
    let max = 10000000;
    const postId = Math.floor(Math.random() * (max - min)) + min;
    const getUser: any = localStorage.getItem('user');
    const user = JSON.parse(getUser).user;
    const userId = user.userId;
    const userName = user.firstName;

    const post = {
      id: 1,
      texte: '',
      date: new Date(),
      userName: 'Jean',
      like: 0,
      commentaire: 0,
      userId: 0,
    }
    post.texte = texte;
    post.id = postId;
    post.userId = userId;
    post.userName = userName;

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

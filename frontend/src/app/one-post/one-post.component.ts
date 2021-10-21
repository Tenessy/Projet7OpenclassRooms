import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css']
})
export class OnePostComponent implements OnInit {
  userName: string;
  texte: string;
  subscribtion: Subscription;
  post: any = []
  constructor(private postService: PostService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log(id);
    this.subscribtion = this.postService.getPost(id).subscribe(
      post => {
        this.post = post;
      },
      error => {
        console.log(error);

      });
    //  this.userName = this.postService.getPostById(+id).userName;
    //  this.texte = this.postService.getPostById(+id).texte;
  }

}

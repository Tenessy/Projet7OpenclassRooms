import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';

import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { PostService } from './services/post.service';
import { registerLocaleData } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { ForumViewComponent } from './forum-view/forum-view.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';
import { OnePostComponent } from './one-post/one-post.component';
import { PublierComponent } from './publier/publier.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { AuthGuard } from './services/auth-guard.service';
import { UserService } from './services/user.service';
import { NewUserComponent } from './new-user/new-user.component';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptor } from './services/tokenInterceptor';
import { EditUserComponent } from './edit-user/edit-user.component';
import { OnePostCommentComponent } from './one-post-comment/one-post-comment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthComponent,
    ForumViewComponent,
    OnePostComponent,
    PublierComponent,
    FourOhFourComponent,
    NewUserComponent,
    RegisterComponent,
    EditUserComponent,
    OnePostCommentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [PostService,
    { provide: LOCALE_ID, useValue: 'fr' },
    [AuthGuard],
    UserService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

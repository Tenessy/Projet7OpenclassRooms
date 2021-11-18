import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { PostService } from './services/post.service';
import { registerLocaleData } from '@angular/common';
import { ForumViewComponent } from './forum-view/forum-view.component';
import { AuthService } from './services/auth.service';
import { OnePostComponent } from './one-post/one-post.component';
import { PublierComponent } from './publier/publier.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { AuthGuard } from './services/auth-guard.service';
import { UserService } from './services/user.service';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptor } from './services/tokenInterceptor';
import { EditUserComponent } from './edit-user/edit-user.component';
import { PublicationComponent } from './publication/publication.component';
import { TestComponent } from './test/test.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForumViewComponent,
    OnePostComponent,
    PublierComponent,
    FourOhFourComponent,
    UserComponent,
    RegisterComponent,
    EditUserComponent,
    PublicationComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    NgbModule,
  ],
  providers: [PostService,
    { provide: LOCALE_ID, useValue: 'fr' },
    [AuthGuard],
    UserService,
    AuthService,
    NgbActiveModal,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

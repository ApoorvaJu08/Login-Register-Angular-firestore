import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  messageBoolean: boolean = false;
  message: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
  }

  onKey(email){
    this.afs.collection('users').snapshotChanges().forEach(a => {
      a.forEach(item => {
        if(email == item.payload.doc.data()["email"]){
          this.message = "User already exists";
        }
      })
    })
  }

  onSubmit(){
    this.authService.register(this.email, this.password)
    .then(res => {
      this.afs.collection('users').add({
        email: this.email,
        password: this.password
      })
      this.flashMessage.show('You are now registered and logged in', {
        cssClass: 'alert-success', timeout: 4000
      });
      // this.router.navigate(['/login']);
    })
    .catch(err => {
      // switch(err.code){
      //   case "auth/email-already-exists": {
      //     this.messageBoolean = true;
      //     this.message = "email already exists";
      //     break;
      //   }
      //   // default: {
      //   //   this.messageBoolean = true;
      //   //   this.message = "error";
      //   //   break;
      //   // }
      // }
      // this.message = err.message
      this.flashMessage.show(err.message, {
        cssClass: 'alert-danger', timeout: 4000
      });
    })
  }


}

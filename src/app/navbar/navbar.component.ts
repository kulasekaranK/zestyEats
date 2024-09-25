import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent  {
  cartSubject = new BehaviorSubject<any[]|null>(null)
  cart$ = this.cartSubject.asObservable()
  constructor(private authservice: AuthService, private firestore: Firestore) {
this.load()
  
  }

   load(){
    const collectionRef = collection(this.firestore, 'carts/');
    this.authservice.users$.subscribe((user) => {
      if (user) {
        const queryRef =  query(collectionRef, where('uid', '==', user.uid));
        onSnapshot(queryRef, (snapshot) => {
          this.cartSubject.next( snapshot.docs.map((doc) => doc.data()))
        });
      }
    });
  }

  
}

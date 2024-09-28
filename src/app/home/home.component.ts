import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { collection, Firestore, orderBy, query } from '@angular/fire/firestore';
import { limit, onSnapshot } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { FooterComponent } from "../footer/footer.component";
import { getToken, Messaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, RouterLink, CommonModule, FormsModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  menuSubject = new BehaviorSubject<any[]>([]); 
  menu$ = this.menuSubject.asObservable();
  categories:any;

  constructor(private firestore: Firestore, private messaging:Messaging, private router:Router ) {
    this.loadNew();
    this.loadCategory();
  }
  goToMenuWithCategory(categoryName:any){
    this.router.navigate(['/menu'],{queryParams:{category:categoryName}});
  }

  async loadNew() {
    const collectionRef = collection(this.firestore, 'foodItems');
    const querySnap = query(collectionRef, orderBy("createdAt","desc"),  limit(4));
    
    onSnapshot(querySnap, (snapshot) => {
      this.menuSubject.next(snapshot.docs.map((doc) => doc.data()));
    });
  }
  loadCategory(){
    const collectionRef = collection(this.firestore, "categorys");
    onSnapshot(collectionRef,(snapshot)=>{
      this.categories = snapshot.docs.map(doc=>({id:doc.id, ...doc.data()}));
    })
  }


  ngOnInit() {
    this.requestPermission();
    this.registerServiceWorker();
  }

  requestPermission() {
    getToken(this.messaging, {
      vapidKey: ''
    })
    .then((currentToken) => {
      if (currentToken) {
        console.log('Yeah, we have the token');
        console.log(currentToken);
      } else {
        console.log('We have a problem');
      }
    })
    .catch((err) => {
      console.error('An error occurred while retrieving token.', err);
    });
  }

   registerServiceWorker() {
 
      navigator.serviceWorker.register('firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }












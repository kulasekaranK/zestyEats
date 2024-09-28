import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { collection, getDocs, onSnapshot, query, where, doc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.scss',
})
export class AdminNavbarComponent {
  neworders=0;

  constructor(private authservice: AuthService, private router: Router, private firestore: Firestore) {
    this.loadNewOrders();
  }

  signout() {
    this.authservice.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  loadNewOrders() {
    const collectionRef = collection(this.firestore, 'orders');
    onSnapshot(collectionRef, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.loadNewOrdersItems(orders);
    });
  }
  
  async loadNewOrdersItems(orders: any[]) {
    let totalNewOrdersCount = 0;
    await Promise.all(
      orders.map(async (order: any) => {
        const docRef = doc(this.firestore, 'orders', order.id);
        const collectionRef = collection(docRef, 'items');
        const q = query(collectionRef, where('status', '==', 'pending'));
        const snapshot = await getDocs(q);
  
        const newOrders = snapshot.docs.map((doc) => doc.data());
        totalNewOrdersCount += newOrders.length;
      })
    );
    this.neworders = totalNewOrdersCount;
  }
  
}

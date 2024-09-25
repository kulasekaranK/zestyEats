import { Component } from '@angular/core';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import {
  collection,
  Firestore,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from '@angular/fire/firestore';
import { BehaviorSubject, merge } from 'rxjs';
import { CommonModule } from '@angular/common';
import { doc, FieldPath, setDoc, updateDoc, where } from 'firebase/firestore';

@Component({
  selector: 'app-new-orders',
  standalone: true,
  imports: [AdminNavbarComponent, CommonModule],
  templateUrl: './new-orders.component.html',
  styleUrl: './new-orders.component.scss',
})
export class NewOrdersComponent {
  ordersubject = new BehaviorSubject<any[]>([]);
  orders$ = this.ordersubject.asObservable();
  constructor(private firestore: Firestore) {
    this.loadOrders();
  }

   async loadOrders() {
    const collectionRef = collection(this.firestore, 'orders');
    const q = query(collectionRef,orderBy("createdAt","asc"));
    onSnapshot(q, async (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.ordersubject.next(await this.loadOrderItems(orders));
    });
  }
  async loadOrderItems(orders: any) {
    const orderWithItems = await Promise.all(
      orders.map(async (order: any) => {
        const collectionRef = collection(this.firestore,`orders/${order.id}/items`);
        const q = query(collectionRef,where("status","==","pending"))
        const itemSnapshot = await getDocs(q);
        const items = itemSnapshot.docs.map((doc)=>{
          const data = ({id:doc.id, ...doc.data()}) 
          return data;
        })
        return {...order, items};
      })
    );
    return orderWithItems;
  }
 
  async markDelivered(oid: any, iid: any) {  
    console.log(oid, iid);  
    
    try {  
     const docRef = doc(this.firestore, `orders/${oid}/items/${iid}`);  
     await updateDoc(docRef, { status: 'Delivered' });  
     alert('success'); 
   
    } catch (err) {  
     console.log('error', err);  
    }  
    this.loadOrders()
  }
  async markCancel(oid: any, iid: any) {  
    console.log(oid, iid);  
    
    try {  
     const docRef = doc(this.firestore, `orders/${oid}/items/${iid}`);  
     await updateDoc(docRef, { status: 'Canceled'});  
     alert('success');  
    } catch (err) {  
     console.log('error', err);  
    }  
    this.loadOrders()
  }

}

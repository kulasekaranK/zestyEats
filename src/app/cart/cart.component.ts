import { AfterViewInit, Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import {deleteDoc,doc,Firestore, getDoc,increment,updateDoc} from '@angular/fire/firestore';
import { AuthService } from '../service/auth.service';
import { addDoc,collection,getDocs,onSnapshot,query,Timestamp,where,
} from 'firebase/firestore';
import { BehaviorSubject, concat } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { getMessaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartItemsunbject = new BehaviorSubject<any | null>(null);
  cartItems$ = this.cartItemsunbject.asObservable();
  totalAmount: number = 0;
  user = localStorage.getItem('users');
  date = new Date();
  paymentId = '';
  address: any = null;
  Showpayment = false;
  dlvBtn = true;
  Subtotal = 0;
  cart: any;
  doorNo = "";
  city = "";
  landmark = "";

  constructor(
    private firestore: Firestore,
    private authservice: AuthService,
    private router: Router
  ) {
   
    
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      const userId = user.uid; 
      this.user = userId;
    }

    const collectionRef = collection(this.firestore, 'carts/');
    this.authservice.users$.subscribe((user) => {
      if (user) {
        const queryRef = query(collectionRef, where('uid', '==', user.uid));
        onSnapshot(queryRef, (snapshot) => {
          const cartItem = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          this.cartItemsunbject.next(cartItem);
          this.calculateTotal(cartItem);
        });
      }
    });

    this.loadAddress();
  }
  async increase(id: any) {
    try {
      const docRef = doc(this.firestore, `carts/${id}`);
      const getdoc = getDoc(docRef);
      const currentQuantity = (await getdoc).data()?.['quantity'];
      if (currentQuantity < 10) {
        await updateDoc(docRef, { quantity: increment(1) });
      } else {
        alert('Quantity limit reached! You cannot add more than 10 items.');
      }
    } catch {
      console.log('error increasing quantity');
    }
  }
  async decrease(id: any) {
    try {
      const docRef = doc(this.firestore, `carts/${id}`);
      const getdoc = await getDoc(docRef);
      const currentQuantity = getdoc.data()?.['quantity'];
      if (currentQuantity > 1) {
        await updateDoc(docRef, { quantity: increment(-1) });
      } else {
        console.log('quantity cannot be less then 1');
      }
    } catch {
      console.log('error increasing quantity');
    }
  }
  async removeItem(id: any) {
    try {
      console.log(id);

      const docRef = doc(this.firestore, `carts/${id}`);
      await deleteDoc(docRef);
      console.log('success');
    } catch (error) {
      console.log('error:', error);
    }
  }
  calculateTotal(cartItem: any[]) {

    this.Subtotal = cartItem.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.totalAmount = this.Subtotal+ 49 + 20 + 20;
  }

  async loadAddress() {
    const collectionRef = collection(this.firestore, 'users');
    const q = query(collectionRef, where('uid', '==', this.user));

    onSnapshot(q, (snapshot) => {
      const addresses = snapshot.docs
        .map((doc) => doc.data()?.['address'])
        .filter((addr) => addr);
      this.address = addresses.length > 0 ? addresses[0] : null;
    });
  }
  async addAddress() {
    
   try{
    const collectionRef = collection(this.firestore, 'users');
    const q = query(collectionRef, where('uid', '==', this.user));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const docRef = querySnapshot.docs[0].ref;
      const newAddress = `${this.doorNo}, ${this.city}, Landmark: ${this.landmark}`
      await updateDoc(docRef, { address: newAddress});
      console.log("address added");
      
    }
   }
   catch{
    console.log("error");
    
   }
    this.loadAddress();
  }
  showPayment(){
    this.Showpayment = true;
    this.dlvBtn = false;
  }

  payWithRazorpay() {
    const options = {
      key: 'rzp_test_6Gb1Ke4aRqS8bX',
      amount: this.totalAmount * 100,
      currency: 'INR',
      name: 'ZestyEats',
      description: 'Delicious Food Delivered To Your Door',
      image: 'zestyeats1.png',
      handler: async (response: any) => {
        console.log(response);
        this.paymentId = await response.razorpay_payment_id;
        await this.order(this.cartItemsunbject.getValue());
        this.router.navigate(['/orders']);
      },

      theme: {
        color: '#ff3131',
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  }

  async order(cart: any[]) {
    try {
      const collectionRef = collection(this.firestore, 'orders/');
      const orederRef = await addDoc(collectionRef, {
        uid: this.user,
        totalAmount: this.totalAmount,
        createdAt: Timestamp.now(),
        paymentId: this.paymentId,
        address:this.address
      });

      cart.forEach(async (item) => {
        const subCollectionRef = collection(orederRef, 'items');
        await addDoc(subCollectionRef, {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          date: this.date,
          status: 'pending',
        });
      });
      this.sendOrderNotification();
      await this.deleteAfterOrder();
      this.router.navigate(['/orders']);
    } catch {
      console.log('error to store cart items');
    }
  }
  async deleteAfterOrder() {
    try {
      const collectionRef = collection(this.firestore, 'carts');
      const queryRef = query(collectionRef, where('uid', '==', this.user));
      const querySnapshot = await getDocs(queryRef);
      const deletePromises = querySnapshot.docs.map((docSnapshot) => {
        const docRef = doc(this.firestore, 'carts', docSnapshot.id);
        return deleteDoc(docRef);
      });
      await Promise.all(deletePromises);
      console.log('Documents successfully deleted!');
    } catch (error) {
      console.error('Error deleting documents: ', error);
    }
  }
  sendOrderNotification() {
    const messaging = getMessaging();

    const notificationPayload = {
      notification: {
        title: 'Order Placed!',
        body: 'Your order has been placed successfully!',
        icon: 'zestyeats.png',
      },
    };

    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(notificationPayload.notification.title, {
        body: notificationPayload.notification.body,
        icon: notificationPayload.notification.icon,
      });
    });
  }
}

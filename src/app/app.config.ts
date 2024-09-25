import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideAuth } from '@angular/fire/auth';
import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { provideHttpClient } from '@angular/common/http';
import { provideMessaging} from '@angular/fire/messaging';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDm4uUkwNeXXpkwFRQgj9I6NG6ayxKw9Jo",
  authDomain: "zesty-eats.firebaseapp.com",
  projectId: "zesty-eats",
  storageBucket: "zesty-eats.appspot.com",
  messagingSenderId: "984457752458",
  appId: "1:984457752458:web:7c621293c11ddaa81e6273",
  measurementId: "G-5WCLQ0527R"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(()=>initializeApp(firebaseConfig)),
    provideAuth(()=>getAuth()),
    provideFirestore(()=>getFirestore()),
    provideHttpClient(),
    provideMessaging(()=>getMessaging())
  ],
};

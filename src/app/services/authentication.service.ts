import { Injectable } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private auth: Auth) { }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async createUser(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signIn(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOut() {
    await signOut(this.auth);
  }

  async sendEmailVerification() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      await sendEmailVerification(currentUser);
    } else {
      throw new Error('Current user is null.');
    }
  }
}

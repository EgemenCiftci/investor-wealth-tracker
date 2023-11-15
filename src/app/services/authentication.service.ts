import { Injectable } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, deleteUser, inMemoryPersistence, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private auth: Auth) { }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async register(name: string, email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      await updateProfile(currentUser, { displayName: name, photoURL: undefined });
    } else {
      throw new Error('Current user is null.');
    }
  }

  async login(email: string, password: string, isRemember: boolean) {
    if (isRemember) {
      await setPersistence(this.auth, browserLocalPersistence);
    } else {
      await setPersistence(this.auth, inMemoryPersistence);
    }
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
  }

  async sendEmailVerification() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      if (currentUser.emailVerified) {
        throw new Error('Current user email is already verified.');
      } else {
        await sendEmailVerification(currentUser);
      }
    } else {
      throw new Error('Current user is null.');
    }
  }

  async deleteUser() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      await deleteUser(currentUser);
    } else {
      throw new Error('Current user is null.');
    }
  }
}

import { Injectable } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, deleteUser, inMemoryPersistence, sendEmailVerification, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile } from '@angular/fire/auth';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private auth: Auth) { }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async register(displayName: string, email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      await updateProfile(currentUser, { displayName: displayName, photoURL: undefined });
      await sendEmailVerification(currentUser);
      await signOut(this.auth);
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

  async deleteUser() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
        await deleteUser(currentUser);
    } else {
      throw new Error('Current user is null.');
    }
  }

  async updateUser(displayName: string, email: string, password: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
        if (currentUser.displayName !== displayName) {
          await updateProfile(currentUser, { displayName: displayName, photoURL: undefined });
        }

        if (currentUser.email !== email) {
          await updateEmail(currentUser, email);
        }

        await updatePassword(currentUser, password);
    } else {
      throw new Error('Current user is null.');
    }
  }
}

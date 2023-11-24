import { Injectable } from '@angular/core';
import { Auth, EmailAuthProvider, GoogleAuthProvider, User, browserPopupRedirectResolver, createUserWithEmailAndPassword, deleteUser, inMemoryPersistence, reauthenticateWithCredential, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut, updateEmail, updatePassword, updateProfile } from '@angular/fire/auth';
import { browserLocalPersistence, setPersistence } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isUserInitialized = false;

  constructor(private auth: Auth) {
    this.auth.useDeviceLanguage();
    this.auth.onAuthStateChanged(user => {
      this.isUserInitialized = true;
    }, error => console.error(error));
  }

  getCurrentUser(): User | null {
    if (this.isUserInitialized) {
      return this.auth.currentUser;
    } else {
      const userJson = localStorage.getItem('user');

      if (userJson) {
        return JSON.parse(userJson) as User;
      } else {
        return null;
      }
    }
  }

  isLoggedIn() {
    return this.getCurrentUser()?.emailVerified ?? false;
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

  async loginWithEmailPassword(email: string, password: string, isRemember: boolean) {
    if (isRemember) {
      await setPersistence(this.auth, browserLocalPersistence);
    } else {
      await setPersistence(this.auth, inMemoryPersistence);
    }

    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const userJson = JSON.stringify(userCredential.user);

    if (isRemember) {
      localStorage.setItem('user', userJson);
    }
  }

  async loginWithGoogle(isRemember: boolean) {
    if (isRemember) {
      await setPersistence(this.auth, browserLocalPersistence);
    } else {
      await setPersistence(this.auth, inMemoryPersistence);
    }

    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    const userJson = JSON.stringify(userCredential.user);

    if (isRemember) {
      localStorage.setItem('user', userJson);
    }
  }

  async logout() {
    await signOut(this.auth);
    localStorage.removeItem('user');
  }

  async deleteUser(password: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser?.email) {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      await deleteUser(currentUser);
    } else {
      throw new Error('Current user is null.');
    }
  }

  async updateDisplayName(displayName: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      if (currentUser.displayName !== displayName) {
        await updateProfile(currentUser, { displayName: displayName, photoURL: undefined });
      }
    } else {
      throw new Error('Current user is null.');
    }
  }

  async updateEmail(email: string, password: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser?.email && currentUser.email !== email) {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      await updateEmail(currentUser, email);
      await sendEmailVerification(currentUser);
      await signOut(this.auth);
    } else {
      throw new Error('Current user is null.');
    }
  }

  async updatePassword(oldPassword: string, newPassword: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser?.email) {
      const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
    } else {
      throw new Error('Current user is null.');
    }
  }
}


import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  imageURL: string;
}

export interface UserData {
  name: string;
  email: string;
  profileImage?: string;
  cart: CartItem[];
  recentSearches: string[];
  scannedData?: {
    height?: number;
    weight?: number;
    imageURL?: string;
  };
  createdAt: Date;
  isAdmin: boolean;
}

export const createUserDoc = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: UserData = {
      name: user.displayName || '',
      email: user.email || '',
      profileImage: user.photoURL || '',
      cart: [],
      recentSearches: [],
      createdAt: new Date(),
      isAdmin: false
    };

    await setDoc(userRef, userData);
  }
};

export const getUserCart = async (uid: string): Promise<CartItem[]> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data() as UserData;
    return userData.cart || [];
  }

  return [];
};

export const addToCart = async (uid: string, item: CartItem) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data() as UserData;
    const existingItemIndex = userData.cart.findIndex(cartItem => cartItem.id === item.id && cartItem.size === item.size);

    if (existingItemIndex > -1) {
      userData.cart[existingItemIndex].quantity += item.quantity;
    } else {
      userData.cart.push(item);
    }

    await updateDoc(userRef, { cart: userData.cart });
  }
};

export const removeFromCart = async (uid: string, productId: string, size?: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data() as UserData;
    userData.cart = userData.cart.filter(item => !(item.id === productId && item.size === size));
    
    await updateDoc(userRef, { cart: userData.cart });
  }
};

export const addRecentSearch = async (uid: string, searchQuery: string) => {
  const userRef = doc(db, 'users', uid);
  
  await updateDoc(userRef, {
    recentSearches: arrayUnion(searchQuery)
  });
};

export const updateUserScanData = async (uid: string, scanData: { height?: number; weight?: number; imageURL?: string }) => {
  const userRef = doc(db, 'users', uid);
  
  await updateDoc(userRef, {
    scannedData: scanData
  });
};

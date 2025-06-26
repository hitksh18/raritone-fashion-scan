
import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { User } from 'firebase/auth';

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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageURL: string;
  size?: string;
  quantity: number;
  category: string;
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
  
  return userSnap.data();
};

export const getUserCart = async (uid: string): Promise<CartItem[]> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data().cart || [];
  }
  
  return [];
};

export const addToCart = async (uid: string, item: CartItem) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentCart = userSnap.data().cart || [];
    const existingItemIndex = currentCart.findIndex((cartItem: CartItem) => 
      cartItem.id === item.id && cartItem.size === item.size
    );
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += item.quantity;
    } else {
      currentCart.push(item);
    }
    
    await updateDoc(userRef, { cart: currentCart });
  }
};

export const removeFromCart = async (uid: string, productId: string, size?: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentCart = userSnap.data().cart || [];
    const updatedCart = currentCart.filter((item: CartItem) => 
      !(item.id === productId && item.size === size)
    );
    
    await updateDoc(userRef, { cart: updatedCart });
  }
};

export const updateUserScanData = async (uid: string, data: { height?: number; weight?: number; imageURL?: string }) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { scannedData: data });
};

export const addRecentSearch = async (uid: string, searchTerm: string) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    recentSearches: arrayUnion(searchTerm)
  });
};


import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  category: string;
  stock: number;
  tags: string[];
  createdAt: Date;
}

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...productData,
    createdAt: new Date()
  });
  return docRef.id;
};

export const getProducts = async (): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
};

export const searchProducts = async (searchQuery: string): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(
    productsRef,
    where('tags', 'array-contains-any', [searchQuery.toLowerCase()]),
    limit(20)
  );
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
};

export const getLatestProducts = async (limitCount: number = 6): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
};

export const updateProduct = async (productId: string, updateData: Partial<Product>) => {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, updateData);
};

export const deleteProduct = async (productId: string) => {
  const productRef = doc(db, 'products', productId);
  await deleteDoc(productRef);
};


import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';

export interface ScanData {
  id?: string;
  scanId: string;
  height: number | null;
  weight: number | null;
  imageURL: string | null;
  scanTime: Date;
  device: string;
  tryOnCount: number;
}

export const saveScan = async (uid: string, scanData: Omit<ScanData, 'id' | 'scanTime'>) => {
  const scansRef = collection(db, 'users', uid, 'scans');
  
  await addDoc(scansRef, {
    ...scanData,
    scanTime: new Date()
  });
};

export const getUserScans = async (uid: string): Promise<ScanData[]> => {
  const scansRef = collection(db, 'users', uid, 'scans');
  const q = query(scansRef, orderBy('scanTime', 'desc'));
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ScanData));
};

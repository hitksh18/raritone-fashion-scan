
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export interface ChatMessage {
  id?: string;
  userId: string;
  message: string;
  timestamp: any;
  isAdmin?: boolean;
}

export const sendMessage = async (userId: string, message: string, isAdmin = false) => {
  const messagesRef = collection(db, 'chats', userId, 'messages');
  
  await addDoc(messagesRef, {
    userId,
    message,
    timestamp: serverTimestamp(),
    isAdmin
  });
};

export const fetchMessages = (userId: string, callback: (messages: ChatMessage[]) => void) => {
  const messagesRef = collection(db, 'chats', userId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChatMessage));
    
    callback(messages);
  });
};

export const sendGuestMessage = async (email: string, message: string) => {
  const guestChatsRef = collection(db, 'guestChats');
  
  await addDoc(guestChatsRef, {
    email,
    message,
    timestamp: serverTimestamp()
  });
};

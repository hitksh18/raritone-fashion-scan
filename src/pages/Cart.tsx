
import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { removeFromCart } from '@/lib/user';

const Cart = () => {
  const { user, cart, refreshCart } = useAuth();

  const updateQuantity = async (itemId: string, newQuantity: number, size?: string) => {
    if (newQuantity <= 0) {
      await removeFromCart(user!.uid, itemId, size);
      await refreshCart();
    }
    // Add update quantity logic here
  };

  const removeItem = async (itemId: string, size?: string) => {
    if (user) {
      await removeFromCart(user.uid, itemId, size);
      await refreshCart();
    }
  };

  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to get started</p>
          <Button onClick={() => window.location.href = '/catalog'} className="bg-black text-white hover:bg-gray-800">
            Browse Collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="space-y-6">
            {cart.map((item) => (
              <motion.div
                key={`${item.id}-${item.size}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <img
                  src={item.imageURL}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                  <p className="text-lg font-medium text-gray-900">₹{item.price}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button
                  onClick={() => removeItem(item.id, item.size)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Total: ₹{totalPrice}</span>
            </div>
            <Button className="w-full bg-black text-white hover:bg-gray-800 py-3">
              Proceed to Checkout
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;

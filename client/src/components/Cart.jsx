import React, { useState } from 'react';
import CheckoutModal from './CheckoutModal';

const Cart = ({ cart, clearCart, deviceHash }) => {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

    const handleSuccess = (order) => {
        setOrderSuccess(order);
        setIsCheckoutOpen(false);
        clearCart();
        // Optionally show success message or redirect
        // For now, we'll just show a simple success overlay
    };

    if (orderSuccess) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-2xl text-center max-w-sm w-full">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
                    <p className="text-gray-600 mb-4">Order #{orderSuccess.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        {orderSuccess.paymentMethod === 'UPI'
                            ? 'Please complete payment in your UPI app.'
                            : 'Please pay at the counter.'}
                    </p>
                    <button
                        onClick={() => setOrderSuccess(null)}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-gray-500 text-xs">{itemCount} items</p>
                        <p className="text-xl font-bold">₹{total.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={() => setIsCheckoutOpen(true)}
                        className="bg-black text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-gray-800 transition-colors"
                    >
                        Checkout
                    </button>
                </div>
            </div>

            {isCheckoutOpen && (
                <CheckoutModal
                    cart={cart}
                    total={total}
                    onClose={() => setIsCheckoutOpen(false)}
                    onSuccess={handleSuccess}
                    deviceHash={deviceHash}
                />
            )}
        </>
    );
};

export default Cart;

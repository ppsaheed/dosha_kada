import React, { useState } from 'react';
import axios from 'axios';

const CheckoutModal = ({ cart, total, onClose, onSuccess, deviceHash }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            items: cart,
            total,
            paymentMethod,
            customer: { name, phone },
            deviceHash,
        };

        try {
            // Create order in backend
            const response = await axios.post('/api/orders', orderData);

            if (paymentMethod === 'UPI') {
                // Generate UPI link
                // upi://pay?pa=ppsaheed-3@okaxis&pn=Saheed%20P&am=<ORDER_TOTAL>&cu=INR&aid=uGICAgIDVhdGJXw
                const upiLink = `upi://pay?pa=ppsaheed-3@okaxis&pn=Saheed%20P&am=${total.toFixed(2)}&cu=INR&aid=uGICAgIDVhdGJXw`;

                // In a real mobile app, this would open the UPI app
                window.location.href = upiLink;

                // We assume success for now or ask user to confirm
                // For MVP, we'll just close and show success
                // But ideally we should wait for user to come back
            }

            onSuccess(response.data);
        } catch (error) {
            console.error('Order failed:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Checkout</h2>
                    <button onClick={onClose} className="text-gray-500 text-2xl">&times;</button>
                </div>

                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    <ul className="text-sm text-gray-600 max-h-32 overflow-y-auto">
                        {cart.map((item) => (
                            <li key={item.id} className="flex justify-between py-1">
                                <span>{item.qty} x {item.name}</span>
                                <span>₹{(item.price * item.qty).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Mobile Number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="Cash"
                                    checked={paymentMethod === 'Cash'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-2"
                                />
                                Cash
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-2"
                                />
                                UPI
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors"
                    >
                        {loading ? 'Placing Order...' : `Pay ₹${total.toFixed(2)}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;

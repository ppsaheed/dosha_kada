import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`/api/orders/${id}`, { status });
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return <div className="p-4">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Kitchen Display</h1>
                    <Link to="/" className="text-blue-600 hover:underline">Back to Menu</Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full mb-1 ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">₹{order.total.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="font-medium text-sm mb-1">{order.customer.name}</p>
                                <ul className="text-sm space-y-1">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex justify-between">
                                            <span>{item.qty} x {item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex space-x-2 mt-4">
                                {order.status === 'received' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'cooking')}
                                        className="flex-1 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600"
                                    >
                                        Start Cooking
                                    </button>
                                )}
                                {order.status === 'cooking' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'ready')}
                                        className="flex-1 bg-yellow-500 text-white py-1 rounded text-sm hover:bg-yellow-600"
                                    >
                                        Mark Ready
                                    </button>
                                )}
                                {order.status === 'ready' && (
                                    <button
                                        onClick={() => updateStatus(order.id, 'completed')}
                                        className="flex-1 bg-green-500 text-white py-1 rounded text-sm hover:bg-green-600"
                                    >
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;

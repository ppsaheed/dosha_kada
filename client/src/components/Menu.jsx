import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = ({ addToCart, removeFromCart, cart }) => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get('/api/menu');
                setMenu(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching menu:', error);
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const getQty = (itemId) => {
        const item = cart.find((i) => i.id === itemId);
        return item ? item.qty : 0;
    };

    if (loading) {
        return <div className="text-center py-10">Loading menu...</div>;
    }

    // Group by category
    const groupedMenu = menu.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            {Object.entries(groupedMenu).map(([category, items]) => (
                <div key={category}>
                    <h2 className="text-lg font-bold text-gray-700 mb-3 border-b pb-1">{category}</h2>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-gray-500">₹{item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {getQty(item.id) > 0 ? (
                                        <>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="font-semibold w-4 text-center">{getQty(item.id)}</span>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full font-bold"
                                            >
                                                +
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(item)}
                                            className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full shadow-sm active:scale-95 transition-transform"
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Menu;

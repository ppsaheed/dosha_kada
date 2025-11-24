import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = ({ addToCart, removeFromCart, cart }) => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    // State to track selected variant for each group: { baseName: 'Chicken' | 'Duck' }
    const [selections, setSelections] = useState({});

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

    // Helper to process menu items into groups
    const processMenu = (items) => {
        const groups = {};
        const singles = [];

        items.forEach(item => {
            // Check for Chicken (കോഴി) / Duck (താറാവ്) pattern
            // Matches: "Name (കോഴി...)" or "Name (താറാവ്...)"
            const match = item.name.match(/(.+?)\s*\((കോഴി|താറാവ്)(.*)\)/);

            if (match) {
                const baseName = match[1].trim();
                const type = match[2]; // കോഴി or താറാവ്
                const suffix = match[3] || ''; // e.g. " ഡബിൾ"

                // Create a unique key for the group (e.g., "Omelette ഡബിൾ")
                // If suffix exists, append it to baseName for the display name
                const displayName = suffix ? `${baseName}${suffix}` : baseName;

                if (!groups[displayName]) {
                    groups[displayName] = {
                        isGroup: true,
                        name: displayName,
                        category: item.category,
                        variants: {}
                    };
                }
                groups[displayName].variants[type] = item;
            } else {
                singles.push(item);
            }
        });

        // Combine groups and singles back into a list, preserving category order
        // For simplicity, we'll just return the processed list and let the renderer handle categories
        return [...singles, ...Object.values(groups)];
    };

    const processedItems = processMenu(menu);

    // Group by category again
    const groupedMenu = processedItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const handleToggle = (groupName, type) => {
        setSelections(prev => ({
            ...prev,
            [groupName]: type
        }));
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedMenu).map(([category, items]) => (
                <div key={category}>
                    <h2 className="text-lg font-bold text-gray-700 mb-3 border-b pb-1">{category}</h2>
                    <div className="space-y-4">
                        {items.map((item) => {
                            if (item.isGroup) {
                                // Determine currently selected variant (default to കോഴി/Chicken if available, else first key)
                                const variantKeys = Object.keys(item.variants);
                                const currentType = selections[item.name] || (variantKeys.includes('കോഴി') ? 'കോഴി' : variantKeys[0]);
                                const currentItem = item.variants[currentType];

                                return (
                                    <div key={item.name} className="bg-white p-3 rounded-lg shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-gray-500">₹{currentItem.price.toFixed(2)}</p>
                                            </div>

                                            {/* iOS Style Toggle */}
                                            <div className="bg-gray-200 p-1 rounded-lg flex text-xs font-medium">
                                                {variantKeys.map(type => (
                                                    <button
                                                        key={type}
                                                        onClick={() => handleToggle(item.name, type)}
                                                        className={`px-3 py-1 rounded-md transition-all ${currentType === type
                                                                ? 'bg-white text-black shadow-sm'
                                                                : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                    >
                                                        {type === 'കോഴി' ? 'Chicken' : 'Duck'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-2">
                                            <div className="flex items-center space-x-3">
                                                {getQty(currentItem.id) > 0 ? (
                                                    <>
                                                        <button
                                                            onClick={() => removeFromCart(currentItem.id)}
                                                            className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="font-semibold w-4 text-center">{getQty(currentItem.id)}</span>
                                                        <button
                                                            onClick={() => addToCart(currentItem)}
                                                            className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full font-bold"
                                                        >
                                                            +
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => addToCart(currentItem)}
                                                        className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full shadow-sm active:scale-95 transition-transform"
                                                    >
                                                        Add
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                // Regular Item
                                return (
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
                                );
                            }
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Menu;

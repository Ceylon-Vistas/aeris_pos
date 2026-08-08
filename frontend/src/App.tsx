import {useState} from "react";
import type {Product, CartItem, BillRequest} from "./types";

const products: Product[] = [
    {
        id: 1,
        name: "Chicken Burger",
        price: 1800
    },
    {
        id: 2,
        name: "Beef Burger",
        price: 2200
    },
    {
        id: 3,
        name: "French Fries",
        price: 900
    },
    {
        id: 4,
        name: "Coca Cola",
        price: 500
    },
    {
        id: 5,
        name: "Chicken Pizza",
        price: 2600
    },
    {
        id: 6,
        name: "Beef Pizza",
        price: 3400
    }
];

function App() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [saving, setSaving] = useState(false);

    const addToCart = (product: Product) => {
        setCart(currentCart => {
            const existing = currentCart.find(
                item => item.id === product.id
            );

            if (existing) {
                return currentCart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    const increaseQuantity = (id: number) => {
        setCart(currentCart =>
            currentCart.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setCart(currentCart =>
            currentCart
                .map(item =>
                    item.id === id
                        ? {
                            ...item,
                            quantity: item.quantity - 1
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const removeItem = (id: number) => {
        setCart(currentCart =>
            currentCart.filter(item => item.id !== id)
        );
    };

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const totalItems = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    const saveBill = async () => {
        if (cart.length === 0) {
            return;
        }

        const bill: BillRequest = {
            items: cart,
            subtotal
        };

        try {
            setSaving(true);

            const response = await fetch(
                "http://localhost:8080/api/bills",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bill)
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to save bill"
                );
            }

            alert("Bill saved successfully");

            setCart([]);

        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the POS server."
            );

        } finally {

            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}

            <header className="bg-white border-b border-gray-200">

                <div className="px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Aeris POS
                        </h1>

                        <p className="text-sm text-gray-500">
                            Point of Sale System
                        </p>
                    </div>

                    <div className="text-right">

                        <p className="text-sm text-gray-500">
                            Items
                        </p>

                        <p className="text-xl font-semibold">
                            {totalItems}
                        </p>

                    </div>

                </div>

            </header>

            {/* MAIN */}

            <main className="p-6">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* PRODUCTS */}

                    <section className="lg:col-span-2">

                        <div className="mb-4">

                            <h2 className="text-xl font-semibold text-gray-900">
                                Products
                            </h2>

                            <p className="text-sm text-gray-500">
                                Select a product to add it
                                to the bill.
                            </p>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                            {products.map(product => (

                                <button
                                    key={product.id}
                                    onClick={() =>
                                        addToCart(product)
                                    }
                                    className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-sm transition"
                                >

                                    <div className="h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">

                                        <span className="text-gray-400 text-sm">
                                            Product
                                        </span>

                                    </div>

                                    <h3 className="font-semibold text-gray-900">
                                        {product.name}
                                    </h3>

                                    <p className="mt-2 text-lg font-bold text-blue-600">
                                        Rs.{" "}
                                        {product.price.toLocaleString()}
                                    </p>

                                </button>

                            ))}

                        </div>

                    </section>

                    {/* CART */}

                    <section>

                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

                            <div className="px-5 py-4 border-b border-gray-200">

                                <h2 className="text-lg font-semibold">
                                    Current Bill
                                </h2>

                            </div>

                            <div className="p-5">

                                {cart.length === 0 ? (

                                    <div className="py-16 text-center">

                                        <p className="text-gray-400">
                                            No items added
                                        </p>

                                        <p className="text-sm text-gray-400 mt-1">
                                            Select products to start
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-4">

                                        {cart.map(item => (

                                            <div
                                                key={item.id}
                                                className="border-b border-gray-100 pb-4"
                                            >

                                                <div className="flex justify-between">

                                                    <div>

                                                        <h3 className="font-medium text-gray-900">
                                                            {item.name}
                                                        </h3>

                                                        <p className="text-sm text-gray-500">
                                                            Rs.{" "}
                                                            {item.price.toLocaleString()}
                                                        </p>

                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                        className="text-sm text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                                <div className="flex items-center justify-between mt-3">

                                                    <div
                                                        className="flex items-center border border-gray-300 rounded-lg">

                                                        <button
                                                            onClick={() =>
                                                                decreaseQuantity(
                                                                    item.id
                                                                )
                                                            }
                                                            className="px-3 py-1.5 hover:bg-gray-100"
                                                        >
                                                            −
                                                        </button>

                                                        <span className="px-4 py-1.5 border-x border-gray-300">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                increaseQuantity(
                                                                    item.id
                                                                )
                                                            }
                                                            className="px-3 py-1.5 hover:bg-gray-100"
                                                        >
                                                            +
                                                        </button>

                                                    </div>

                                                    <p className="font-semibold">
                                                        Rs.{" "}
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toLocaleString()}
                                                    </p>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                                {/* TOTAL */}

                                <div className="mt-6 pt-4 border-t border-gray-200">

                                    <div className="flex justify-between text-gray-600">

                                        <span>
                                            Subtotal
                                        </span>

                                        <span>
                                            Rs.{" "}
                                            {subtotal.toLocaleString()}
                                        </span>

                                    </div>

                                    <div className="flex justify-between mt-2 text-xl font-bold">

                                        <span>
                                            Total
                                        </span>

                                        <span>
                                            Rs.{" "}
                                            {subtotal.toLocaleString()}
                                        </span>

                                    </div>

                                </div>

                                {/* SAVE */}

                                <button
                                    onClick={saveBill}
                                    disabled={
                                        cart.length === 0 ||
                                        saving
                                    }
                                    className="w-full mt-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Bill"}
                                </button>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default App;
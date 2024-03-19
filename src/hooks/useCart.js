import { useEffect, useMemo, useState } from "react";
import { db } from "../data/db";

export const useCart = () => {

    const initialCart = () => {
		// si existe informacion, se establece en el estado inicial
		const localStorageCart =  localStorage.getItem('cartReact');
		return localStorageCart ? JSON.parse(localStorageCart) : [];
	}

	const [data] = useState(db);
	const [cart, setCart] = useState(initialCart);
	const MAX_ITEMS = 5;
	const MIN_ITEMS = 1;

    useEffect(() => {
		localStorage.setItem('cartReact',JSON.stringify(cart));
	},[cart]);

	// agregar elementos al carrito mediante esta funcion llamandose desde guitar
	function addToCart(item) {
		const itemsExists = cart.findIndex((guitar) => guitar.id === item.id);
		if(itemsExists >= 0){ // existe en el carrito
			if(cart[itemsExists].quantity >= MAX_ITEMS) return;
			// hacer una copia del carrito para no modificar el existente
			const updateCart = [...cart];
			updateCart[itemsExists].quantity++;
			// guardar el nuevo carrito actualizado
			setCart(updateCart);
		}else{ // no existe, agregar
			item.quantity = 1;
			setCart([...cart, item]);
		}
	}

	// buscar los id que son diferentes al que se va a eliminar y regresar
	function removeFormCart (id) {
		setCart((prevCart) => prevCart.filter(guitar => guitar.id != id));
	}

	function increaseQuantity(id){
		const updatedCart = cart.map((item) => {
			if(item.id === id && item.quantity < MAX_ITEMS){
				return {
					...item,
					quantity: item.quantity + 1
				}
			}
			return item;
		})
		setCart(updatedCart);
	}

	function decreaseQuantity(id){
		const updatedCart = cart.map((item) => {
			if(item.id === id && item.quantity > MIN_ITEMS){
				return {
					...item,
					quantity: item.quantity - 1
				}
			}
			return item;
		})
		setCart(updatedCart);
	}

	function clearCart(){
		setCart([]);
	}

    // state derivado, usar useMemo para que solo se llame cuando cambia cart
    const isEmpty = useMemo(() => cart.length === 0, [cart]);
    // iterar el carrito, se suma la multiplicacion de cantidad x precio
    const cartTotal = useMemo(() => cart.reduce((total,item) => total + (item.quantity * item.price), 0),[cart]);

    return {
        data,
        cart,
        addToCart,
        removeFormCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}
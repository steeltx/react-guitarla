import { useEffect, useState } from "react";
import Guitar from "./components/Guitar";
import Header from "./components/Header";
import { db } from "./data/db";

function App() {

	const initialCart = () => {
		// si existe informacion, se establece en el estado inicial
		const localStorageCart =  localStorage.getItem('cartReact');
		return localStorageCart ? JSON.parse(localStorageCart) : [];
	}

	const [data] = useState(db);
	const [cart, setCart] = useState(initialCart);
	const MAX_ITEMS = 5;
	const MIN_ITEMS = 1;

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

	useEffect(() => {
		localStorage.setItem('cartReact',JSON.stringify(cart));
	},[cart]);

	return (
		<>
			<Header 
				cart={cart}
				removeFormCart={removeFormCart}
				increaseQuantity={increaseQuantity}
				decreaseQuantity={decreaseQuantity}
				clearCart={clearCart}
			/>
			<main className="container-xl mt-5">
				<h2 className="text-center">Nuestra Colección</h2>

				<div className="row mt-5">
					{
						data.map((guitar) => (
							<Guitar 
								key={guitar.id}
								guitar={guitar}
								cart={cart}
								setCart={setCart}
								addToCart={addToCart}
							/>
						))
					}
				</div>
			</main>

			<footer className="bg-dark mt-5 py-5">
				<div className="container-xl">
					<p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
				</div>
			</footer>
		</>
	)
}

export default App;

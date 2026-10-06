import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "../../composables/useCart";

const product = {
  id: 1,
  name: "Fabada Asturiana",
  price: 10,
};

const secondProduct = {
  id: 2,
  name: "Cachopo",
  price: 20,
};

describe("useCart", () => {
  beforeEach(() => {
    const { cartItems } = useCart();
    cartItems.value = [];
  });

  it("empieza con el carrito vacío", () => {
    const { cartItems, subtotal, tax, total } = useCart();

    expect(cartItems.value).toEqual([]);
    expect(subtotal.value).toBe(0);
    expect(tax.value).toBe(0);
    expect(total.value).toBe(0);
  });

  it("añade un producto al carrito", () => {
    const { cartItems, addItem } = useCart();

    addItem(product);

    expect(cartItems.value).toHaveLength(1);
    expect(cartItems.value[0].product).toEqual(product);
    expect(cartItems.value[0].quantity).toBe(1);
  });

  it("aumenta la cantidad si se añade un producto que ya existe", () => {
    const { cartItems, addItem } = useCart();

    addItem(product);
    addItem(product);

    expect(cartItems.value).toHaveLength(1);
    expect(cartItems.value[0].quantity).toBe(2);
  });

  it("elimina un producto del carrito", () => {
    const { cartItems, addItem, removeItem } = useCart();

    addItem(product);
    addItem(secondProduct);

    removeItem(product.id);

    expect(cartItems.value).toHaveLength(1);
    expect(cartItems.value[0].product.id).toBe(secondProduct.id);
  });

  it("aumenta la cantidad de un producto", () => {
    const { cartItems, addItem, increaseQuantity } = useCart();

    addItem(product);

    increaseQuantity(product.id);

    expect(cartItems.value[0].quantity).toBe(2);
  });

  it("disminuye la cantidad de un producto cuando es mayor que uno", () => {
    const {
      cartItems,
      addItem,
      increaseQuantity,
      decreaseQuantity,
    } = useCart();

    addItem(product);
    increaseQuantity(product.id);
    increaseQuantity(product.id);

    decreaseQuantity(product.id);

    expect(cartItems.value[0].quantity).toBe(2);
  });

  it("elimina el producto cuando se disminuye una cantidad igual a uno", () => {
    const { cartItems, addItem, decreaseQuantity } = useCart();

    addItem(product);

    decreaseQuantity(product.id);

    expect(cartItems.value).toHaveLength(0);
  });

  it("calcula correctamente el subtotal", () => {
    const { addItem, increaseQuantity, subtotal } = useCart();

    addItem(product);
    increaseQuantity(product.id);

    addItem(secondProduct);

    expect(subtotal.value).toBe(40);
  });

  it("calcula correctamente el impuesto del 10%", () => {
    const { addItem, subtotal, tax } = useCart();

    addItem(product);

    expect(subtotal.value).toBe(10);
    expect(tax.value).toBe(1);
  });

  it("calcula correctamente el total", () => {
    const { addItem, total } = useCart();

    addItem(product);

    expect(total.value).toBe(11);
  });
});
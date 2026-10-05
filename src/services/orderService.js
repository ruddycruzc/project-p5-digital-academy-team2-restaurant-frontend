import { getToken } from "../utils/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return data;
}

export async function createOrder(payload) {
  const token = getToken();

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function payOrder(orderId, paymentData) {
  const token = getToken();

  const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  });

  return handleResponse(response);
}

export async function getOrderById(orderId) {
  const token = getToken();

  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}
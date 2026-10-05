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

export async function getReadyOrders() {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/orders?status=READY`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function getOrdersOnTheWay() {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/orders?status=ON_THE_WAY`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function getDeliveredOrders() {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/orders?status=DELIVERED`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function startDelivery(orderId) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/orders/${orderId}/status?status=ON_THE_WAY`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function completeDelivery(orderId) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/orders/${orderId}/status?status=DELIVERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}
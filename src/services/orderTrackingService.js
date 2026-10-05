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

export async function getOrderTracking(orderId) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/orders/${orderId}/tracking`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}
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

export async function getBillingReport(startDate, endDate) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/billing/report?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function getBillingReportPdf(startDate, endDate) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/billing/report/pdf?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return handleResponse(response);
}

export async function getInvoice(orderId) {
  const token = getToken();

  const response = await fetch(`${API_URL}/billing/invoice/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

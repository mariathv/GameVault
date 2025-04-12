const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import api from "../../api/index"

export const fetchData = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("gamevault_token")

    // Set up headers with authentication if token exists
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { message: response.statusText }
      }

      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`API Response (${endpoint}):`, data)
    return data
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

export const apiRequest = async (endpoint, bodyData = {}, method = "POST", customHeaders = {}) => {
  try {
    const token = localStorage.getItem("gamevault_token");

    const config = {
      method,
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...customHeaders,
      },
    };

    if (method.toUpperCase() === "GET") {
      config.params = bodyData;
    } else {
      config.data = bodyData;
    }

    console.log(`API Request (${endpoint}):`, {
      method,
      bodyData,
      hasToken: !!token,
    });

    const response = await api(config);
    console.log(`API Response (${endpoint}):`, response.data);
    return response.data;
  } catch (error) {
    const customMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    console.error("API Request Error:", customMessage);

    throw new Error(customMessage);
  }
};


export const fetchDataDummy = async (endpoint) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (endpoint === "store/stats") {
    return {
      totalGames: 50,
      totalSales: 150,
      totalRevenue: 4500.5,
      activeUsers: 250,
    }
  } else if (endpoint === "store/games/get-all?limit=5") {
    return {
      games: [
        { id: 5, name: "Grand Theft Auto V", price: 29.99, cover_url: "/placeholder.svg?height=120&width=90" },
        { id: 6, name: "Minecraft", price: 19.99, cover_url: "/placeholder.svg?height=120&width=90" },
        {
          id: 7,
          name: "Call of Duty: Modern Warfare",
          price: 59.99,
          cover_url: "/placeholder.svg?height=120&width=90",
        },
        { id: 8, name: "Fortnite", price: 0.0, cover_url: "/placeholder.svg?height=120&width=90" },
        { id: 9, name: "Apex Legends", price: 0.0, cover_url: "/placeholder.svg?height=120&width=90" },
      ],
    }
  } else if (endpoint === "store/purchases/recent") {
    return {
      purchases: [
        { id: 4, game: "Grand Theft Auto V", user: "test@example.com", date: "2023-04-16", price: 29.99 },
        { id: 5, game: "Minecraft", user: "demo@example.com", date: "2023-04-15", price: 19.99 },
        { id: 6, game: "Call of Duty: Modern Warfare", user: "guest@example.com", date: "2023-04-14", price: 59.99 },
      ],
    }
  } else {
    console.log("Unknown endpoint:", endpoint)
    return null
  }
}


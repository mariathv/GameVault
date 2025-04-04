const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import api from "../../api/index"

/**
 * Base fetch function for API calls
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
export const fetchData = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("gamevault_token")

    // Set up headers with authentication if token exists
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    // Clear timeout
    clearTimeout(timeoutId)

    if (!response.ok) {
      // Try to parse error message from response
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
    throw error // Rethrow to let caller handle errors
  }
}

/**
 * Make API request using axios-like client
 * @param {string} endpoint - API endpoint
 * @param {Object} bodyData - Request body data
 * @param {string} method - HTTP method
 * @param {Object} customHeaders - Custom headers
 * @returns {Promise<Object>} - Response data
 */
export const apiRequest = async (endpoint, bodyData = {}, method = "POST", customHeaders = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("gamevault_token")

    const config = {
      method,
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...customHeaders,
      },
    }

    if (method.toUpperCase() === "GET") {
      config.params = bodyData // For GET, use query params
    } else {
      config.data = bodyData // For POST, PUT, etc, use body
    }

    console.log(`API Request (${endpoint}):`, {
      method,
      bodyData,
      hasToken: !!token,
    })

    const response = await api(config)
    console.log(`API Response (${endpoint}):`, response.data)
    return response.data
  } catch (error) {
    console.error("API Request Error:", error?.response?.data || error.message)
    throw error // Let caller handle errors
  }
}


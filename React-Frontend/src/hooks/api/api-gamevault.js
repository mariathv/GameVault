const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const fetchData = async (endpoint) => {
    let success = false;
    while (!success) {
        try {
            const data = await fetch(`${API_BASE_URL}/${endpoint}`, {
                timeout: 20000,
            });
            if (!data.ok) {
                throw new Error(`HTTP error! Status: ${data.status}`);
            }
            const Json = await data.json();
            success = true;
            return Json;
        } catch (error) { }
    }
};

export const apiRequest = async (endpoint, bodyData, method = "POST") => {
    console.log("Base URL:", API_BASE_URL);
    let success = false;

    while (!success) {
        try {
            console.log(bodyData);
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: bodyData ? JSON.stringify(bodyData) : null,
                timeout: 20000,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            success = true;
            return json;
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }
};

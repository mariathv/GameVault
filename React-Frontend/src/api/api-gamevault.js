const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const fetchData = async (endpoint) => {
    console.log("base url ", API_BASE_URL);
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
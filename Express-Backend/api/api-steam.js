const API_BASE_URL = process.env.API_STEAM;

const fetchData = async (endpoint) => {
    let success = false;
    while (!success) {
        try {
            const url = `${API_BASE_URL}/${endpoint}`;
            const data = await fetch(url, {
                timeout: 20000,
            });
            if (!data.ok) {
                throw new Error(`HTTP error! Status: ${data.status}`);
            } else {
                console.log(`[${new Date().toISOString()}] --- fetched steam data from ${url}`);

            }
            const Json = await data.json();
            success = true;
            return Json;
        } catch (error) { }
    }
};

module.exports = { fetchData };

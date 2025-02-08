const API_BASE_URL = process.env.API_IGDB;
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_KEY;
const IGDB_TOKEN = process.env.IGDB_TOKEN;

const fetchIGDB = async (endpoint, fetch_body) => {
    let success = false;

    while (!success) {
        try {
            const url = `${API_BASE_URL}/${endpoint}`;
            const data = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': `${IGDB_CLIENT_ID}`,
                    'Authorization': `Bearer ${IGDB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: fetch_body, // Wrap the body in a 'query' field if necessary
            })
                .then(response => response.json())
                .catch(err => {
                    console.error(err);
                });

            console.log(`[${new Date().toISOString()}] --- fetched data from ${url}, body ${fetch_body}`);
            success = true;
            return data;  // Return the parsed JSON data

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
};


module.exports = { fetchIGDB };

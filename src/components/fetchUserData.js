const API_BASE_URL = "http://167.71.169.127:5000"; // Ensure correct API URL

const fetchUserData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/get-users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

export default fetchUserData;

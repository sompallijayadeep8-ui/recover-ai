const API_URL = "http://localhost:3000/api";

export async function getAnalyticsOverview() {
    const response = await fetch(
        `${API_URL}/analytics/overview`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch analytics"
        );
    }

    return response.json();
}

export async function getTransactions() {
    const response = await fetch(
        `${API_URL}/transactions`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch transactions"
        );
    }

    return response.json();
}
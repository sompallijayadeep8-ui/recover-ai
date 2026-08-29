import { useEffect, useState } from "react";
import {
    getAnalyticsOverview,
    getTransactions
} from "../services/api";

function Dashboard() {

    const [analytics, setAnalytics] =
        useState(null);

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    useEffect(() => {

        async function loadDashboard() {

            try {

                const [
                    analyticsData,
                    transactionData
                ] = await Promise.all([
                    getAnalyticsOverview(),
                    getTransactions()
                ]);

                setAnalytics(analyticsData);
                setTransactions(transactionData);

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load dashboard data"
                );

            } finally {

                setLoading(false);

            }
        }

        loadDashboard();

    }, []);


    if (loading) {
        return <h2>Loading RecoverAI...</h2>;
    }


    if (error) {
        return <h2>{error}</h2>;
    }


    return (
        <div>

            <h1>RecoverAI Dashboard</h1>

            <pre>
                {JSON.stringify(
                    analytics,
                    null,
                    2
                )}
            </pre>

            <h2>
                Transactions
            </h2>

            <pre>
                {JSON.stringify(
                    transactions,
                    null,
                    2
                )}
            </pre>

        </div>
    );
}

export default Dashboard;
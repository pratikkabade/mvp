import { HEALTH_CHECK_URL } from "../constants/URL";

export const fetchServerStatus = async () => {
    try {
        const res = await fetch(HEALTH_CHECK_URL);
        const status = res.status;
        return status === 200;
    } catch (error) {
        console.error("Error fetching status:", error);
        return false;
    }
};

import { URL } from "../constants/URL";

export const fetchServerStatus = async () => {
    try {
        const res = await fetch(URL);
        const values = await res.json();
        return values.response === '200';
    } catch (error) {
        console.error("Error fetching status:", error);
        return false;
    }
};

import { useEffect, useState } from 'react';
import { fetchTools, type Tool } from '../mock-api';

export function useTools() {
	const [tools, setTools] = useState<Tool[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null | boolean>(null);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await fetchTools();
				setTools(data);
			} catch (err) {
				if (err instanceof Error) {
					if (err.message === "Failed to fetch") {
						setError("Network error. Please check your connection.");
					} else if (err.message === "HTTP 500") {
						setError("Server error. Please try again later.");
					} else {
						setError("Something went wrong.");
					}
				}
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);
	return { tools, loading, error };
}

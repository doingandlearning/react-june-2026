import { useEffect, useState } from "react";

export interface User { id: number; name: string }

export function UserCard({ fetchUser }: { fetchUser: () => Promise<User> }) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		fetchUser().then(setUser);
	}, [fetchUser]);

	if (!user) return <p>Loading...</p>;
	return <p>Welcome, {user?.name || "Guest"}</p>;
}
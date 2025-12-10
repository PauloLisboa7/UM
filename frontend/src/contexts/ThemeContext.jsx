import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		try {
			const stored = localStorage.getItem("theme");
			if (stored === "light" || stored === "dark") return stored;
			return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		} catch (e) {
			return "light";
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem("theme", theme);
		} catch (e) {}
		document.documentElement.classList.toggle("theme-dark", theme === "dark");
	}, [theme]);

	const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;

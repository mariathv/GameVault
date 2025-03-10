/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	prefix: "",

	// Note: tailwindcss-animate plugin may need to be updated for v4 compatibility
	plugins: [],
}
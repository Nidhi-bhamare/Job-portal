/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/**/*.{js,jsx,ts,tsx}",
	  "./public/index.html",
	],
	theme: {
	  extend: {
		colors: {
		  background: '#f0f0f0', // Add your custom color here if you want to use bg-background
		},
	  },
	},
	plugins: [],
  };

  
  
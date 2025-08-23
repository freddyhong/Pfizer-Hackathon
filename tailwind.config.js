/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "pfizer-blue-1": "#15144B",
        "pfizer-blue-2": "#272C77",
        "pfizer-blue-3": "#33429D",
        "pfizer-blue-4": "#3857A6",
        "pfizer-blue-5": "#488CCA",
        "pfizer-blue-6": "#74BBE6",
        "pfizer-blue-7": "#CFEAFB",
        "pfizer-blue-8": "#EBF5FC",
      },
    },
  },
  plugins: [],
};

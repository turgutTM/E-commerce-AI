/** @type {import('tailwindcss').Config} */
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "custom-background": "url('/glasses.jpg')",
        orange: "url('/orange-photo.jpg')",
        clothes: "url('/clothesphoto1.jpg')",
      },
      keyframes: {
        draw: {
          "0%": { strokeDashoffset: "400" },
          "100%": { strokeDashoffset: "0" },
        },
        fill: {
          "0%": { fill: "transparent" },
          "100%": { fill: "#ffffff" },
        },
      },
      animation: {
        draw: "draw 2s ease-in-out forwards",
        fill: "fill 0.5s 2s forwards",
      },
    },
  },
  plugins: [],
});

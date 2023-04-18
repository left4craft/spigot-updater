import withMaterial from "@material-tailwind/html/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMaterial({
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        blurple: '#5865F2',
        dark: '#2e2e2e',
        darker: '#212121',
        light: '#505050',
        primary: '#4caf50',
        secondary: '#66aa44'
      }
    }
  },
  plugins: [],
});


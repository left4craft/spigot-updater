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
        secondary: '#66aa44',
        midnight: {
          50: "#eff1f7",
          100: "#d0d6e8",
          200: "#b1bad9",
          300: "#929eca",
          400: "#7383ba",
          500: "#5467ab",
          600: "#45548c",
          700: "#35426d",
          800: "#262f4e",
          900: "#171c2f",
          950: "#080910",
        },
      }
    }
  },
  plugins: [],
});


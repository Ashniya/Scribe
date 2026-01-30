import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: false,
  },
})
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   darkMode: 'class',
//   theme: {
//     extend: {
//       colors: {
//         scribe: {
//           green: '#89986D',
//           sage: '#9CAB84',
//           mint: '#C5D89D',
//           cream: '#F6F0D7',
//         },
//       },
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//       },
//       animation: {
//         'fadeInUp': 'fadeInUp 1s ease-out forwards',
//         'float': 'float 3s ease-in-out infinite',
//         'float-slow': 'float-slow 8s ease-in-out infinite',
//         'bubble': 'bubble 10s ease-in infinite',
//         'spin-slow': 'spin 3s linear infinite',
//       },
//       keyframes: {
//         fadeInUp: {
//           'from': {
//             opacity: '0',
//             transform: 'translateY(30px)',
//           },
//           'to': {
//             opacity: '1',
//             transform: 'translateY(0)',
//           },
//         },
//         float: {
//           '0%, 100%': {
//             transform: 'translateY(0) translateX(0)',
//           },
//           '50%': {
//             transform: 'translateY(-20px) translateX(10px)',
//           },
//         },
//         'float-slow': {
//           '0%, 100%': {
//             transform: 'translateY(0) translateX(0) rotate(0deg)',
//           },
//           '33%': {
//             transform: 'translateY(-30px) translateX(20px) rotate(5deg)',
//           },
//           '66%': {
//             transform: 'translateY(-15px) translateX(-10px) rotate(-3deg)',
//           },
//         },
//         bubble: {
//           '0%': {
//             transform: 'translateY(0) scale(1)',
//             opacity: '0.6',
//           },
//           '50%': {
//             opacity: '0.3',
//           },
//           '100%': {
//             transform: 'translateY(-100vh) scale(1.5)',
//             opacity: '0',
//           },
//         },
//       },
//     },
//   },
//   plugins: [],
// }
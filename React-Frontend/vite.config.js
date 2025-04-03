import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react(), tailwindcss(),],
=======
  plugins: [react(), tailwindcss()],
>>>>>>> 37b50d5 (message)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },

<<<<<<< HEAD
})
=======
})
>>>>>>> 37b50d5 (message)

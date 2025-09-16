import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      //todo lo que empiece por simpson se reenvia
      "/simpson-cdn":{
        target:"https://simpsoncdn.com",
        changeOrigin:true, //finge que el origen es el target
        secure:true,
        rewrite:(path) => path.replace(/^\/simpson-cdn/,"") //quita el prefijo del path
      }
    }
  }
})

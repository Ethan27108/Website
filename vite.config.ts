import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/signup': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/loginpage': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/UploadingPhotos': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/GettingImage': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/Comments': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/AddComments': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/deletePhoto': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/getUserDetails': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/ChangeSettings': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/MessagePage': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/SingleMessage': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/MessageSent': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/FriendSearch': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/FriendAdd': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    }
  }
})

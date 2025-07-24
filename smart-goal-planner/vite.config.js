import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // or vue, svelte, etc.

export default defineConfig({
  base: '/smart-goal-pl/',  
  plugins: [react()],
});

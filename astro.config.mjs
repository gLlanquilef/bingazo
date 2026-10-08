// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Sitio 100% estático: Cloudflare Pages lo sirve directo desde dist/.
	site: 'https://bingazo.cantariadigital.cl',
});

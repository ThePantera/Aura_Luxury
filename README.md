# Perfum Luxury

E-commerce de perfumería de diseñador, árabe y de nicho, con experiencia 100vh sin scroll, precios en ARS y USD y checkout por WhatsApp.

Stack: Next.js (App Router), TypeScript, TailwindCSS, Lucide, Prisma y PostgreSQL.

## Puesta en marcha

1. Instalar dependencias (también genera el cliente de Prisma):
   ```bash
   npm install
   ```
2. Copiar `.env.example` a `.env` y completar `DATABASE_URL` con una base PostgreSQL.
3. Crear las tablas y cargar el catálogo inicial:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
4. Levantar el entorno de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts de base de datos

| Script | Qué hace |
| --- | --- |
| `npm run db:migrate` | Aplica y crea migraciones en desarrollo |
| `npm run db:deploy` | Aplica migraciones en producción |
| `npm run db:seed` | Carga o actualiza los perfumes de ejemplo (se puede correr varias veces) |

## Modelo de datos

`Product` (ver `prisma/schema.prisma`): nombre, marca, categoría (`Arabian`, `Designer`, `Niche`, `Decant`), presentación (`Cerrado`, `Tester`, `Mini Talla`), precios ARS y USD, notas de salida, corazón y fondo, usos recomendados (`Gym`, `Office`, `Night`, `Summer`, `Winter`), duración en horas, badge (`Best Seller`, `Viral`, `Offer`, `None`), imagen y stock.

## Hoja de ruta

1. Setup del proyecto y base de datos
2. Interfaz 100vh y navegación
3. Carrito múltiple y Asesor Olfativo
4. Panel de administración
5. Optimización y deployment en Vercel

# Perfum Luxury

E-commerce de perfumería de diseñador, árabe y de nicho, con experiencia 100vh sin scroll, precios en ARS y USD y checkout por WhatsApp.

Stack: Next.js (App Router), TypeScript, TailwindCSS, Lucide, Prisma y PostgreSQL.

## Puesta en marcha

1. Instalar dependencias (también genera el cliente de Prisma):
   ```bash
   npm install
   ```
2. Copiar `.env.example` a `.env` y completar `DATABASE_URL` (PostgreSQL) y las variables del panel: `ADMIN_USER`, `ADMIN_PASSWORD` y `AUTH_SECRET` (al menos 32 caracteres al azar, por ejemplo `openssl rand -base64 32`).
3. Crear las tablas y cargar el catálogo inicial:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
4. Levantar el entorno de desarrollo:
   ```bash
   npm run dev
   ```

## Panel de administración

En `/admin` (con el usuario y la contraseña de `.env`) se puede:

- Crear, editar y eliminar perfumes.
- Importar el catálogo desde Excel (.xlsx) o CSV. Hay una plantilla descargable en la misma página. Los perfumes se identifican por marca y nombre: los existentes se actualizan y los nuevos se crean. Las filas con errores se saltean y se informan.
- Cambiar la cotización del dólar (y opcionalmente recalcular todos los precios en USD) y el teléfono de WhatsApp que recibe los pedidos.

## Scripts de base de datos

| Script | Qué hace |
| --- | --- |
| `npm run db:migrate` | Aplica y crea migraciones en desarrollo |
| `npm run db:deploy` | Aplica migraciones en producción |
| `npm run db:seed` | Carga o actualiza los perfumes de ejemplo (se puede correr varias veces) |

## Modelo de datos

`Product` (ver `prisma/schema.prisma`): nombre, marca, categoría (`Arabian`, `Designer`, `Niche`, `Decant`), género (`Masculino`, `Femenino`, `Unisex`), presentación (`Cerrado`, `Tester`, `Mini Talla`), precios ARS y USD, notas de salida, corazón y fondo, usos recomendados (`Gym`, `Office`, `Night`, `Summer`, `Winter`), duración en horas, badge (`Best Seller`, `Viral`, `Offer`, `None`), imagen y stock.

## Hoja de ruta

1. Setup del proyecto y base de datos
2. Interfaz 100vh y navegación
3. Carrito múltiple y Asesor Olfativo
4. Panel de administración
5. Optimización y deployment en Vercel

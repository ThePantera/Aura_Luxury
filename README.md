# Aura Luxury

E-commerce de perfumería de diseñador, árabe y de nicho, con catálogo en grilla (búsqueda, filtros y orden), precios en ARS y USD y checkout por WhatsApp.

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

`Product` (ver `prisma/schema.prisma`): nombre, marca, categoría (`Arabian`, `Designer`, `Niche`, `Decant`), género (`Masculino`, `Femenino`, `Unisex`), presentación (`Cerrado`, `Tester`, `Mini Talla`), mililitros (columna `ML`; si falta se toma del nombre), precios ARS y USD, notas de salida, corazón y fondo, usos recomendados (`Gym`, `Office`, `Night`, `Summer`, `Winter`), duración en horas, badge (`Best Seller`, `Viral`, `Offer`, `None`), imagen y stock.

## Deploy en Vercel

1. Crear una base PostgreSQL. Se recomienda [Neon](https://neon.tech) en la región São Paulo (`aws-sa-east-1`), que queda cerca de la región de Vercel elegida en `vercel.json` (`gru1`). Copiar la cadena de conexión **directa** (la que no dice `-pooler`), porque las migraciones la necesitan.
2. En Vercel, importar el repositorio desde GitHub. Next.js se detecta solo.
3. En *Settings → Environment Variables* cargar `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASSWORD` y `AUTH_SECRET` (al menos 32 caracteres al azar).
4. Deployar. El script `vercel-build` aplica las migraciones pendientes (`prisma migrate deploy`) y después compila.
5. Solo la primera vez, cargar el catálogo de ejemplo y los ajustes por defecto desde tu computadora, con la misma `DATABASE_URL` en `.env`:
   ```bash
   npm run db:seed
   ```
   Si preferís arrancar vacío, alcanza con entrar a `/admin`, ir a Ajustes y guardar la cotización y el WhatsApp.

Las fotos de los frascos van en `public/products/<slug>.webp` o como URL https desde el panel. Mientras una foto carga o si falla, se muestra un frasco dorado con las iniciales de la marca.

## Hoja de ruta

1. Setup del proyecto y base de datos
2. Interfaz 100vh y navegación
3. Carrito múltiple y Asesor Olfativo
4. Panel de administración
5. Optimización y deployment en Vercel

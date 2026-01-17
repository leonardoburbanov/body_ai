# Scripts

## add-routine.ts

Script para añadir la rutina de ejemplo de transformación a la base de datos.

## add-recipe.ts

Script para añadir el plan nutricional semanal de ejemplo a la base de datos.

### Uso

```bash
# Añadir receta sin asignar a un usuario específico
pnpm add-recipe

# Añadir receta asignada a un usuario específico
pnpm add-recipe [userId]
```

### Ejemplos

```bash
# Receta sin usuario asignado (puede asignarse después)
pnpm add-recipe

# Receta asignada a un usuario específico
pnpm add-recipe 507f1f77bcf86cd799439011
```

### Requisitos

- Variable de entorno `MONGODB_URL` configurada (ver sección de configuración arriba)
- La base de datos MongoDB debe estar accesible

### Descripción

Este script añade un plan nutricional semanal completo que incluye:

- **Objetivos nutricionales**: Calorías y proteína diarias
- **Plan semanal completo**: 7 días con 3 comidas por día
- **Ingredientes detallados**: Con cantidades específicas para cada comida
- **Variedad de alimentos**: Pollo, pescado, cerdo, huevos, carbohidratos, verduras y frutas

### Estructura del plan

El plan incluye:

- **Calorías diarias objetivo**: 2200-2300 kcal
- **Proteína diaria objetivo**: 160-170 g
- **Comidas por día**: 3
- **Frutas por día**: 2
- **7 días completos** con desayuno, almuerzo y cena detallados

### Notas

- Si la receta ya existe con el mismo nombre (y userId si se proporciona), el script no la duplicará
- La receta se guarda en la colección `recipes` de MongoDB
- Cada receta incluye timestamps de creación y actualización

### Uso

```bash
# Añadir rutina sin asignar a un usuario específico
pnpm add-routine

# Añadir rutina asignada a un usuario específico
pnpm add-routine [userId]
```

### Ejemplos

```bash
# Rutina sin usuario asignado (puede asignarse después)
pnpm add-routine

# Rutina asignada a un usuario específico
pnpm add-routine 507f1f77bcf86cd799439011
```

### Requisitos

- Variable de entorno `MONGODB_URL` configurada en uno de estos lugares:
  - Archivo `.env.local` en la raíz del proyecto (recomendado)
  - Archivo `.env` en la raíz del proyecto
  - Variable de entorno del sistema
- La base de datos MongoDB debe estar accesible

### Configuración de MONGODB_URL

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
MONGODB_URL=mongodb://localhost:27017/body_ai
```

O si usas MongoDB Atlas:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/body_ai
```

**Nota**: El archivo `.env.local` está en `.gitignore` y no se subirá al repositorio.

### Descripción

Este script añade la rutina completa de transformación (12-16 semanas) que incluye:

- **7 días de entrenamiento** (Lunes a Domingo)
- **Ejercicios detallados** con series y repeticiones
- **Cardio** en días específicos
- **Notas** para descanso activo
- **Información nutricional** (calorías, proteínas, grasas, carbohidratos)
- **Suplementos recomendados**
- **Mensaje motivacional**

### Estructura de la rutina

La rutina incluye:

- **LUNES**: Torso (ESPALDA) + Running
- **MARTES**: Pierna (FUERZA + GLÚTEO)
- **MIÉRCOLES**: Torso (PECHO + HOMBRO) + ABS
- **JUEVES**: DESCANSO ACTIVO
- **VIERNES**: Pierna (VOLUMEN + CADERA)
- **SÁBADO**: Torso LIGERO + Running + ABS
- **DOMINGO**: DESCANSO TOTAL

### Notas

- Si la rutina ya existe con el mismo nombre (y userId si se proporciona), el script no la duplicará
- La rutina se guarda en la colección `routines` de MongoDB
- Cada rutina incluye timestamps de creación y actualización

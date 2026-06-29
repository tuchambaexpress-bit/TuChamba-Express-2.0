# Spec: Registro de Agencia Verificada

## Objetivo
Permitir que nuevas agencias se registren cumpliendo con el Mandamiento 3 (Gestión unificada) y Mandamiento 7 (Cifrado)[cite: 4].

## Requisitos Técnicos
- **Frontend:** Formulario en Next.js con validación de RFC y nombre legal[cite: 2].
- **Backend:** Insertar datos en la tabla `agencias` de Supabase[cite: 1].
- **Seguridad:** 
  - La agencia inicia con `verificada = false` por defecto[cite: 1].
  - Implementar RLS para que solo el Admin pueda validar la cuenta[cite: 4].

## Criterios de Aceptación
1. El usuario recibe confirmación de registro exitoso.
2. Los datos se guardan cifrados en reposo en la base de datos[cite: 4].
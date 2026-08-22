export function validarPassword(password: string): string | null {
  if (password.length < 8 || password.length > 12) {
    return 'Debe tener entre 8 y 12 caracteres.'
  }
  if (!/[a-zA-Z]/.test(password)) return 'Debe incluir al menos una letra.'
  if (!/[0-9]/.test(password)) return 'Debe incluir al menos un número.'
  if (!/[^a-zA-Z0-9]/.test(password)) return 'Debe incluir al menos un símbolo (ej. !@#$%).'
  return null
}

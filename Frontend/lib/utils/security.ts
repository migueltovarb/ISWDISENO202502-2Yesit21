export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "").substring(0, 1000)
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T
  for (const key in obj) {
    const value = obj[key]
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value) as T[typeof key]
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

export function validateToken(token: string | null): boolean {
  if (!token) return false
  if (token.length < 10) return false
  return token.startsWith("mock_token_")
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 6
}

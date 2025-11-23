import type React from "react"
interface AuthTemplateProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthTemplate({ children, title, subtitle }: AuthTemplateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

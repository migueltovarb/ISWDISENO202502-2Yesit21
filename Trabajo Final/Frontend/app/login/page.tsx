import { LoginFormOrganism } from "@/components/organisms/auth/login-form-organism"
import { AuthTemplate } from "@/components/templates/auth-template"

export default function LoginPage() {
  return (
    <AuthTemplate
      title="Sistema de Reserva de Salas"
      subtitle="Gestiona tus reservas de salas de estudio de forma fácil y rápida"
    >
      <LoginFormOrganism />
    </AuthTemplate>
  )
}

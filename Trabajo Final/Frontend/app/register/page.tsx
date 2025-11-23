import { RegisterFormOrganism } from "@/components/organisms/auth/register-form-organism"
import { AuthTemplate } from "@/components/templates/auth-template"

export default function RegisterPage() {
  return (
    <AuthTemplate
      title="Sistema de Reserva de Salas"
      subtitle="Crea tu cuenta para comenzar a reservar salas de estudio"
    >
      <RegisterFormOrganism />
    </AuthTemplate>
  )
}

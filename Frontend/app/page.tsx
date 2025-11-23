export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistema de Reserva de Salas de Estudio</h1>
        <p className="text-lg text-gray-600 mb-8">Reserva salas de estudio de manera fácil y rápida</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Iniciar Sesión
          </a>
          <a
            href="/register"
            className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Registrarse
          </a>
        </div>
      </div>
    </div>
  )
}

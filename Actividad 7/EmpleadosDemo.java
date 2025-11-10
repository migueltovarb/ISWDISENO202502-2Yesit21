// actividad 7
public class EmpleadosDemo {
    public static void main(String[] args) {
        // Crear empleados
        Secretario secretario = new Secretario("Ana", "García", "12345678A", "Calle Mayor 1", "600000001", 20000, "Despacho 1", "912345678");
        Vendedor vendedor = new Vendedor("Carlos", "López", "87654321B", "Calle Pequeña 2", "600000002", 18000,
                                        "ABC123", "Toyota", "Corolla", "611111111", "Madrid", 5.0);
        JefeZona jefe = new JefeZona("María", "Rodríguez", "11223344C", "Calle Grande 3", "600000003", 35000,
                                    "Despacho Principal", "XYZ789", "BMW", "Serie 3");

        // Asignar supervisor al vendedor
        vendedor.cambiarSupervisor(jefe);

        // Asignar secretario al jefe
        jefe.cambiarSecretario(secretario);

        // Dar de alta vendedor al jefe
        jefe.darAltaVendedor(vendedor);

        // Mostrar información inicial
        System.out.println("=== INFORMACIÓN INICIAL ===");
        System.out.println(secretario);
        System.out.println("\n" + vendedor);
        System.out.println("\n" + jefe);

        // Incrementar salarios
        System.out.println("\n=== INCREMENTANDO SALARIOS ===");
        secretario.incrementarSalario();
        vendedor.incrementarSalario();
        jefe.incrementarSalario();

        System.out.println("Salario secretario después de incremento: " + secretario.salario);
        System.out.println("Salario vendedor después de incremento: " + vendedor.salario);
        System.out.println("Salario jefe después de incremento: " + jefe.salario);

        // Operaciones con vendedor
        System.out.println("\n=== OPERACIONES CON VENDEDOR ===");
        vendedor.darAltaCliente("Cliente 1");
        vendedor.darAltaCliente("Cliente 2");
        System.out.println("Clientes del vendedor: " + vendedor.toString());

        vendedor.darBajaCliente("Cliente 1");
        System.out.println("Después de dar baja cliente: " + vendedor.toString());

        vendedor.cambiarCoche("DEF456", "Honda", "Civic");
        System.out.println("Después de cambiar coche: " + vendedor.toString());
    }
}
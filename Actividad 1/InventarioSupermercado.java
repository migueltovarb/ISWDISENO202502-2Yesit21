import java.util.Scanner;

public class InventarioSupermercado {
    // Constante con el máximo de productos
    static final int MAX_PRODUCTOS = 5;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String[] nombres = new String[MAX_PRODUCTOS];
        int[] cantidades = new int[MAX_PRODUCTOS];
        int totalProductos = 0;

        // Ingresar productos y cantidades
        System.out.println("=== REGISTRO DE PRODUCTOS ===");
        for (int i = 0; i < MAX_PRODUCTOS; i++) {
            System.out.print("Ingrese el nombre del producto " + (i + 1) + ": ");
            nombres[i] = sc.nextLine();

            int cantidad;
            do {
                System.out.print("Ingrese la cantidad disponible de " + nombres[i] + ": ");
                cantidad = sc.nextInt();
                if (cantidad < 0) {
                    System.out.println("No puede ingresar cantidades negativas.");
                }
            } while (cantidad < 0);

            cantidades[i] = cantidad;
            totalProductos += cantidad;
            sc.nextLine();
        }

        int opcion;
        do {
            System.out.println("\n=== MENÚ INVENTARIO ===");
            System.out.println("1. Mostrar todos los productos ");
            System.out.println("2. Buscar un producto ");
            System.out.println("3. Actualizar inventario");
            System.out.println("4. Alerta de productos ");
            System.out.println("5. Salir");
            System.out.print("Seleccione una opción: ");
            opcion = sc.nextInt();
            sc.nextLine();

            switch (opcion) {
                case 1:
                    System.out.println("\n--- Productos en inventario ---");
                    totalProductos = 0;
                    for (int i = 0; i < MAX_PRODUCTOS; i++) {
                        System.out.println(nombres[i] + ": " + cantidades[i]);
                        totalProductos += cantidades[i];
                    }
                    System.out.println("Total de productos en inventario: " + totalProductos);
                    break;

                case 2:
                    System.out.print("Ingrese el nombre del producto a buscar: ");
                    String buscar = sc.nextLine();
                    boolean encontrado = false;
                    for (int i = 0; i < MAX_PRODUCTOS; i++) {
                        if (nombres[i].equalsIgnoreCase(buscar)) {
                            System.out.println("Cantidad de " + nombres[i] + ": " + cantidades[i]);
                            encontrado = true;
                            break;
                        }
                    }
                    if (!encontrado) {
                        System.out.println("Producto no encontrado.");
                    }
                    break;

                case 3:
                    System.out.print("Ingrese el nombre del producto a actualizar: ");
                    String actualizar = sc.nextLine();
                    boolean actualizado = false;
                    for (int i = 0; i < MAX_PRODUCTOS; i++) {
                        if (nombres[i].equalsIgnoreCase(actualizar)) {
                            System.out.print("Ingrese la nueva cantidad para " + nombres[i] + ": ");
                            int nuevaCantidad = sc.nextInt();
                            if (nuevaCantidad >= 0) {
                                cantidades[i] = nuevaCantidad;
                                System.out.println("Inventario actualizado correctamente.");
                            } else {
                                System.out.println(" No puede ingresar cantidades negativas.");
                            }
                            actualizado = true;
                            sc.nextLine();
                            break;
                        }
                    }
                    if (!actualizado) {
                        System.out.println("Producto no encontrado.");
                    }
                    break;

                case 4:
                    System.out.println("\n Productos con cantidad menor a 10 ");
                    boolean alerta = false;
                    for (int i = 0; i < MAX_PRODUCTOS; i++) {
                        if (cantidades[i] < 10) {
                            System.out.println(""+ nombres[i] + " (Cantidad: " + cantidades[i] + ")");
                            alerta = true;
                        }
                    }
                    if (!alerta) {
                        System.out.println("No hay productos con cantidad menor a 10.");
                    }
                    break;

                case 5:
                    System.out.println("Saliendo del sistema de inventario.");
                    break;

                default:
                    System.out.println( "Opción no válida. Intente de nuevo.");
            }
        } while (opcion != 5);

        sc.close();
    }
}


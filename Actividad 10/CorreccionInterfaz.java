// actividad 10
public interface ConversorDivisa {
    double convertir(Double cantidad);
}

public class EuroDolarConversorDivisa implements ConversorDivisa {
    @Override
    public double convertir(Double cantidad) {
        return cantidad * 1.50;
    }

    @Override
    public String toString() {
        return "Conversor de Euros a Dólares";
    }
}
// Las interfaces no deben ser privadas si van a ser implementadas fuera de su clase contenedora por eso es que 
// en este caso es publica.
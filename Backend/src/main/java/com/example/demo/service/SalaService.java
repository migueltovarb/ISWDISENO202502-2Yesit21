package com.example.demo.service;

import com.example.demo.model.Sala;
import com.example.demo.model.Auditoria;
import com.example.demo.model.Usuario;
import com.example.demo.repository.SalaRepository;
import com.example.demo.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SalaService {

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    public List<Sala> obtenerTodasLasSalas() {
        return salaRepository.findAll();
    }

    public List<Sala> obtenerSalasDisponibles() {
        return salaRepository.findByDisponible(true);
    }

    public List<Sala> buscarSalasPorCapacidad(int capacidadMinima) {
        return salaRepository.findByCapacidadGreaterThanEqual(capacidadMinima);
    }

    public List<Sala> buscarSalasPorUbicacion(String ubicacion) {
        return salaRepository.findByUbicacion(ubicacion);
    }

    public Optional<Sala> obtenerSalaPorId(String id) {
        return salaRepository.findById(id);
    }

    public Sala crearSala(Sala sala, Usuario administrador) {
        Sala salaGuardada = salaRepository.save(sala);

        registrarAuditoria(administrador, "CREAR_SALA", "SALA", salaGuardada.getId(),
                          "Sala creada: " + sala.getNombre());

        return salaGuardada;
    }

    public Sala actualizarSala(String id, Sala salaActualizada, Usuario administrador) {
        Optional<Sala> salaExistente = salaRepository.findById(id);
        if (salaExistente.isEmpty()) {
            throw new IllegalArgumentException("Sala no encontrada");
        }

        salaActualizada.setId(id);
        Sala salaGuardada = salaRepository.save(salaActualizada);

        registrarAuditoria(administrador, "ACTUALIZAR_SALA", "SALA", id,
                          "Sala actualizada: " + salaActualizada.getNombre());

        return salaGuardada;
    }

    public void eliminarSala(String id, Usuario administrador) {
        Optional<Sala> sala = salaRepository.findById(id);
        if (sala.isEmpty()) {
            throw new IllegalArgumentException("Sala no encontrada");
        }

        salaRepository.deleteById(id);

        registrarAuditoria(administrador, "ELIMINAR_SALA", "SALA", id,
                          "Sala eliminada: " + sala.get().getNombre());
    }

    private void registrarAuditoria(Usuario usuario, String accion, String entidad, String entidadId, String detalles) {
        Auditoria auditoria = new Auditoria(usuario, accion, entidad, entidadId, detalles);
        auditoriaRepository.save(auditoria);
    }
}
package com.example.demo.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;

/**
 * Servicio que implementa la interfaz UserDetailsService de Spring Security.
 * Carga los detalles del usuario desde MongoDB para la autenticación.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Carga un usuario por su email para la autenticación.
     * Busca en la base de datos MongoDB y crea un UserDetails con el rol como autoridad.
     *
     * @param email Email del usuario a buscar
     * @return UserDetails con información del usuario para Spring Security
     * @throws UsernameNotFoundException si el usuario no existe
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        // Crea UserDetails con email, contraseña y rol como autoridad
        return new org.springframework.security.core.userdetails.User(
            usuario.getEmail(), // Username
            usuario.getPassword(), // Password (debería estar hasheada)
            Collections.singletonList(new SimpleGrantedAuthority(usuario.getRol())) // Authorities/Roles
        );
    }
}
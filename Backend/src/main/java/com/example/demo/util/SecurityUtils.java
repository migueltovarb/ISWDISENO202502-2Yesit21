package com.example.demo.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;

public class SecurityUtils {
    
    /**
     * Obtiene el usuario autenticado actual desde el contexto de seguridad JWT
     * 
     * @param usuarioRepository Repositorio para buscar el usuario completo
     * @return Usuario autenticado o null si no hay autenticación
     */
    public static Usuario getCurrentUser(UsuarioRepository usuarioRepository) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof UserDetails userDetails) {
            String email = userDetails.getUsername();
            return usuarioRepository.findByEmail(email).orElse(null);
        }
        
        return null;
    }
    
    /**
     * Obtiene el email del usuario autenticado actual
     * 
     * @return Email del usuario o null
     */
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        }
        
        return null;
    }
    
    /**
     * Verifica si el usuario actual tiene un rol específico
     * 
     * @param rol Rol a verificar (ESTUDIANTE, ADMINISTRADOR)
     * @return true si tiene el rol, false en caso contrario
     */
    public static boolean hasRole(String rol) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        return authentication.getAuthorities().stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + rol));
    }
}

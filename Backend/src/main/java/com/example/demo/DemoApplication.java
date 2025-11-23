package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;

@SpringBootApplication
@EnableScheduling // Habilita las tareas programadas
public class DemoApplication implements CommandLineRunner {

	@Autowired
	private UsuarioRepository usuarioRepository;
	
	@Autowired
	private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Crear usuario administrador si no existe
		if (usuarioRepository.findByEmail("admin@test.com").isEmpty()) {
			Usuario admin = new Usuario();
			admin.setNombre("Administrador");
			admin.setEmail("admin@test.com");
			admin.setPassword(passwordEncoder.encode("admin123")); // Password encriptado correctamente
			admin.setRol("ADMINISTRADOR");
			admin.setTelefono("555-0001");
			admin.setCarrera("Administración");
			admin.setActivo(true);
			usuarioRepository.save(admin);
			System.out.println("✅ Usuario administrador creado: admin@test.com / admin123");
		}
	}
}

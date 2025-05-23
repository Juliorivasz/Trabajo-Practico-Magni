package com.example.intrumentos;

import com.example.intrumentos.Entities.Usuario;
import com.example.intrumentos.Repository.UsuarioRepository;
import com.example.intrumentos.utils.PasswordUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class IntrumentosApplication {

	public static void main(String[] args) {
		SpringApplication.run(IntrumentosApplication.class, args);
	}
	@Bean
	public CommandLineRunner initData(UsuarioRepository usuarioRepository) {
		return args -> {
			if (usuarioRepository.count() == 0) { // Solo si no hay usuarios
				Usuario admin = new Usuario("admin", PasswordUtil.encryptMD5("admin123"), "Admin");
				Usuario operador = new Usuario("operador", PasswordUtil.encryptMD5("operador123"), "Operador");
				Usuario visor = new Usuario("visor", PasswordUtil.encryptMD5("visor123"), "Visor");

				usuarioRepository.save(admin);
				usuarioRepository.save(operador);
				usuarioRepository.save(visor);
				System.out.println("Usuarios de prueba creados.");
			}
		};
	}

}

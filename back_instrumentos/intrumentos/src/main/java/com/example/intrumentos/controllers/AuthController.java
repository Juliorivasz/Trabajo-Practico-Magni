package com.example.intrumentos.controllers;

import com.example.intrumentos.Entities.Usuario;
import com.example.intrumentos.Repository.UsuarioRepository;
import com.example.intrumentos.utils.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

// DTO para el request de login
class LoginRequest {
    private String nombreUsuario;
    private String clave;

    // Getters y Setters
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }
}

// DTO para la respuesta de login (devolvemos el usuario, pero sin la clave)
class LoginResponseDto {
    private Long id;
    private String nombreUsuario;
    private String rol;

    public LoginResponseDto(Long id, String nombreUsuario, String rol) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}

// DTO para mensajes de error
class ErrorResponse {
    private String message;
    public ErrorResponse(String message) { this.message = message; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Ajusta esto si tu frontend no está en localhost:3000
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByNombreUsuario(loginRequest.getNombreUsuario());

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Usuario y/o Clave incorrectos, vuelva a intentar"));
        }

        Usuario usuario = usuarioOptional.get();

        // Verificar la clave encriptada
        if (PasswordUtil.checkPassword(loginRequest.getClave(), usuario.getClave())) {
            // Login exitoso, devolver el usuario sin la clave
            LoginResponseDto responseDto = new LoginResponseDto(usuario.getId(), usuario.getNombreUsuario(), usuario.getRol());
            return ResponseEntity.ok(responseDto);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Usuario y/o Clave incorrectos, vuelva a intentar"));
        }
    }

    // Opcional: Endpoint para crear un usuario de prueba (solo para desarrollo)
    @PostMapping("/register-test")
    public ResponseEntity<?> registerTestUser(@RequestBody LoginRequest registerRequest) {
        if (usuarioRepository.findByNombreUsuario(registerRequest.getNombreUsuario()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("El nombre de usuario ya existe."));
        }
        Usuario nuevoUsuario = new Usuario(
                registerRequest.getNombreUsuario(),
                PasswordUtil.encryptMD5(registerRequest.getClave()), // Encripta la clave al guardar
                "Admin" // O el rol que quieras para el usuario de prueba
        );
        usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ErrorResponse("Usuario de prueba creado exitosamente!"));
    }
}
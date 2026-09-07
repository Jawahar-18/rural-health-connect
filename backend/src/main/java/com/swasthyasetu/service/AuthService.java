package com.swasthyasetu.service;

import com.swasthyasetu.dto.AuthDto.*;
import com.swasthyasetu.entity.Patient;
import com.swasthyasetu.entity.User;
import com.swasthyasetu.entity.enums.UserRole;
import com.swasthyasetu.exception.BadRequestException;
import com.swasthyasetu.mapper.EntityDtoMapper;
import com.swasthyasetu.repository.PatientRepository;
import com.swasthyasetu.repository.UserRepository;
import com.swasthyasetu.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EntityDtoMapper mapper;

    public AuthService(UserRepository userRepository,
                       PatientRepository patientRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       EntityDtoMapper mapper) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.mapper = mapper;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByPhone(request.getUsername()))
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(jwt, mapper.toUserDto(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("User already registered with phone number: " + request.getPhone());
        }

        String userId = "usr-" + UUID.randomUUID().toString().substring(0, 8);
        User user = new User();
        user.setId(userId);
        user.setUsername(request.getPhone());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.PATIENT);
        user.setDistrict(request.getDistrict());
        user.setPreferredLanguage(request.getPreferredLanguage());
        user.setEnabled(true);
        userRepository.save(user);

        // If registered as PATIENT, automatically create linked Patient record
        if (user.getRole() == UserRole.PATIENT) {
            Patient patient = new Patient();
            patient.setId("pat-" + UUID.randomUUID().toString().substring(0, 8));
            patient.setPatientCode("MH-PUN-" + System.currentTimeMillis() % 100000);
            patient.setUserId(userId);
            patient.setFullName(request.getFullName());
            patient.setPhone(request.getPhone());
            patient.setVillage(request.getVillage() != null ? request.getVillage() : "Junnar");
            patient.setDistrict(request.getDistrict() != null ? request.getDistrict() : "Pune");
            patient.setPreferredLanguage(request.getPreferredLanguage());
            patient.setRegisteredDate(LocalDate.now());
            patientRepository.save(patient);
        }

        String jwt = tokenProvider.generateTokenFromUsername(user.getUsername(), user.getRole().name(), user.getId());
        return new AuthResponse(jwt, mapper.toUserDto(user));
    }

    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByPhone(username))
                .orElseThrow(() -> new BadRequestException("User not found"));
        return mapper.toUserDto(user);
    }
}

package com.swasthyasetu.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swasthyasetu.dto.AuthDto.LoginRequest;
import com.swasthyasetu.dto.AuthDto.RegisterRequest;
import com.swasthyasetu.entity.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testLoginSuccess() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setUsername("savita.kamble");
        req.setPassword("Password@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.name").value("Savita Kamble (ASHA)"))
                .andExpect(jsonPath("$.user.role").value("HEALTH_WORKER"));
    }

    @Test
    void testRegisterNewPatient() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Kavita Bhosale");
        req.setPhone("+91 9123456780");
        req.setPassword("Password@123");
        req.setVillage("Otur");
        req.setRole(UserRole.PATIENT);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.name").value("Kavita Bhosale"));
    }
}

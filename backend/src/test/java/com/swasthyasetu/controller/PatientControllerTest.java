package com.swasthyasetu.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swasthyasetu.dto.PatientDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "usr-worker-1", roles = {"HEALTH_WORKER"})
    void testGetAllPatients() throws Exception {
        mockMvc.perform(get("/api/patients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(username = "usr-worker-1", roles = {"HEALTH_WORKER"})
    void testGetPatientById() throws Exception {
        mockMvc.perform(get("/api/patients/pat-101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Anandi Patil"))
                .andExpect(jsonPath("$.village").value("Junnar"));
    }

    @Test
    @WithMockUser(username = "usr-worker-1", roles = {"HEALTH_WORKER"})
    void testCreatePatientWithAutomaticRiskCalculation() throws Exception {
        PatientDto.CreateRequest req = new PatientDto.CreateRequest();
        req.setName("Ganesh Shinde");
        req.setAge(62);
        req.setGender("Male");
        req.setPhone("+91 9765432109");
        req.setVillage("Ambegaon");
        req.setDistanceKm(28.0);
        req.setChronicConditions(List.of("Hypertension", "Type 2 Diabetes"));

        mockMvc.perform(post("/api/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Ganesh Shinde"))
                .andExpect(jsonPath("$.followupRiskLevel").isNotEmpty());
    }
}

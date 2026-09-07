package com.swasthyasetu.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "usr-facadmin-1", roles = {"FACILITY_ADMIN"})
    void testGetFacilityDashboard() throws Exception {
        mockMvc.perform(get("/api/dashboard/facility/fac-phc-junnar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.facilityName").value("PHC Junnar, Pune"))
                .andExpect(jsonPath("$.totalPatientsToday").isNumber());
    }

    @Test
    @WithMockUser(username = "usr-distadmin-1", roles = {"DISTRICT_ADMIN"})
    void testGetDistrictDashboard() throws Exception {
        mockMvc.perform(get("/api/dashboard/district/Pune"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.district").value("Pune"))
                .andExpect(jsonPath("$.facilities").isArray());
    }
}

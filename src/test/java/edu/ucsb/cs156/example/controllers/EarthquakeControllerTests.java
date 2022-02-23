package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.collections.EarthquakesCollection;
import edu.ucsb.cs156.example.documents.EarthquakeFeature;
// import edu.ucsb.cs156.example.entities.Todo;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.repositories.TodoRepository;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = EarthquakeController.class)
@Import(TestConfig.class)
public class EarthquakeControllerTests extends ControllerTestCase {

        @MockBean
        EarthquakesCollection earthquakeCollection;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/earthquakes/all

        @Test
        public void api_earthquakes_all__logged_out__returns_403() throws Exception {
                mockMvc.perform(get("/api/earthquakes/all"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void api_earthquakes_all__user_logged_in__returns_ok() throws Exception {
                mockMvc.perform(get("/api/earthquakes/all"))
                                .andExpect(status().isOk());
        }

        // Authorization tests for /api/earthquakes/post

        @Test
        public void api_earthquakes_post__logged_out__returns_403() throws Exception {
                mockMvc.perform(post("/api/earthquakes/post"))
                                .andExpect(status().is(403));
        }

        // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void api_earthquakes_all__user_logged_in__returns_a_earthquake_that_exists() throws Exception {

                // arrange

                EarthquakeFeature s = Student.builder().perm(1234567).firstName("Chris").lastName("Gaucho").id("7").build();
                ArrayList<EarthquakeFeature> earthquakes = new ArrayList<>();
                when(earthquakeCollection.findAll()).thenReturn(earthquakes);

                // act
                MvcResult response = mockMvc.perform(get("/api/earthquakes/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(earthquakeCollection, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(earthquakes);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void api_earthquakes_post__user_logged_in__creates_a_earthquake() throws Exception {

                EarthquakeFeature expectedEarthquake = Student.builder()
                                .perm(1234567)
                                .firstName("Chris")
                                .lastName("Gaucho")
                                .build();

                when(earthquakeCollection.save(eq(expectedEarthquake))).thenReturn(expectedEarthquake);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/earthquakes/post?perm=1234567&firstName=Chris&lastName=Gaucho") //fix this
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(earthquakeCollection, times(1)).save(expectedEarthquake);
                String expectedJson = mapper.writeValueAsString(expectedEarthquake);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);

        }

}

package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.EarthquakeQueryService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.collections.EarthquakesCollection;
import edu.ucsb.cs156.example.documents.EarthquakeFeatureCollection;
import edu.ucsb.cs156.example.documents.EarthquakeMetadata;
import edu.ucsb.cs156.example.documents.EarthquakeFeature;
import edu.ucsb.cs156.example.documents.EarthquakeFeatureProperties;

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
import java.util.List;
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

        @MockBean
        EarthquakeQueryService mockEarthquakeQueryService;
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

                EarthquakeFeature s = EarthquakeFeature.builder()
                        .type("Earthquake")
                        .build();
                ArrayList<EarthquakeFeature> earthquakes = new ArrayList<>();
                earthquakes.addAll(Arrays.asList(s));
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

        @WithMockUser(roles = { "USER","ADMIN"})
        @Test
        public void api_earthquakes_retrieve_stores_earthquakefeatures() throws Exception{
                // arrange

                EarthquakeFeatureProperties efp = EarthquakeFeatureProperties.builder()
                                .title("Title")
                                .mag(42.2)
                                .place("Place")
                                .time(42)
                                .url("URL")
                                .build();

                EarthquakeMetadata em = EarthquakeMetadata.builder()
                                ._id("")
                                .api("api")
                                .count(1)
                                .generated(1)
                                .status(0)
                                .title("title")
                                .url("url")
                                .build();
                
                EarthquakeFeature ef = EarthquakeFeature.builder()
                                ._id("1")
                                .type("Feature")
                                .properties(efp)
                                .title("")
                                .mag(0)
                                .place("")
                                .time(1)
                                .url("")
                                .build();   

                List<EarthquakeFeature> lef = new ArrayList<>();
                lef.add(ef);   

                EarthquakeFeatureCollection efc = EarthquakeFeatureCollection.builder()
                                ._id("")
                                .features(lef)
                                .metadata(em)
                                .type("EarthquakeFeatureCollection")
                                .build();

                String efcAsJson = mapper.writeValueAsString(efc);
                EarthquakeFeatureCollection savedEfc = mapper.readValue(efcAsJson, EarthquakeFeatureCollection.class);
                // savedEfc.set_id("efgh5678");
                String WHY = mapper.writeValueAsString(savedEfc.getFeatures());

                EarthquakeFeature AFTERef = EarthquakeFeature.builder()
                                ._id("1")
                                .type("Feature")
                                .properties(efp)
                                .title("Title")
                                .mag(42.2)
                                .place("Place")
                                .time(42)
                                .url("URL")
                                .build();
                List<EarthquakeFeature> AFTERlef = new ArrayList<>();
                AFTERlef.add(AFTERef);



                EarthquakeFeatureCollection AFTERefc = EarthquakeFeatureCollection.builder()
                                ._id("1")
                                .features(AFTERlef)
                                .metadata(em)
                                .type("EarthquakeFeatureCollection")
                                .build();

                String AFTERefcAsJson = mapper.writeValueAsString(AFTERefc);
                EarthquakeFeatureCollection AFTERsavedEfc = mapper.readValue(AFTERefcAsJson, EarthquakeFeatureCollection.class);
                // AFTERsavedEfc.set_id("efgh5678");
                String AFTERsavedLefAsJson = mapper.writeValueAsString(AFTERsavedEfc.getFeatures());


                


                when(earthquakeCollection.saveAll(eq(efc.getFeatures()))).thenReturn(savedEfc.getFeatures());
                when(mockEarthquakeQueryService.getJSON(eq("100"),eq("1.5"))).thenReturn(efcAsJson);
                
                // act
                MvcResult response = mockMvc.perform(post("/api/earthquakes/retrieve?distance=100&minMag=1.5").with(csrf()))
                                        .andExpect(status().isOk()).andReturn();

                                        
                // assert
                verify(mockEarthquakeQueryService, times(1)).getJSON(eq("100"),eq("1.5"));
                verify(earthquakeCollection, times(1)).saveAll(eq(AFTERefc.getFeatures()));
                String responseString = response.getResponse().getContentAsString();
                assertEquals(AFTERsavedLefAsJson, responseString);
        }
        
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_purge() throws Exception {
                MvcResult response = mockMvc.perform(post("/api/earthquakes/purge")
                                                        .with(csrf()))
                                                .andExpect(status().isOk())
                                                .andReturn();

                // assert
                verify(earthquakeCollection, times(1)).deleteAll();
                String responseString = response.getResponse().getContentAsString();
                assertEquals("All earthquakes have been deleted.", responseString);
        }
}

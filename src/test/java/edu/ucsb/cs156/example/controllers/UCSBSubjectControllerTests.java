package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBSubject;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.repositories.UCSBSubjectRepository;

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

@WebMvcTest(controllers = UCSBSubjectController.class)
@Import(TestConfig.class)
public class UCSBSubjectControllerTests extends ControllerTestCase {

    @MockBean
    UCSBSubjectRepository ucsbSubjectRepository;

    @MockBean
    UserRepository userRepository;

    @Test
    public void api_UCSBSubjects_get__all__returns_403__logged_out() throws Exception {
        mockMvc.perform(get("/api/ucsbsubjects/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubjects_get__all__returns_200__logged_in() throws Exception {
        mockMvc.perform(get("/api/ucsbsubjects/all"))
                .andExpect(status().isOk());
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubject_all__user_logged_in__returns_UCSBSubjects_for_user() throws Exception {
        UCSBSubject s1 = UCSBSubject.builder().subjectCode("testSubjectCode").subjectTranslation("testSubjectTranslation").deptCode("testDeptCode").collegeCode("testCollegeCode").relatedDeptCode("testRelatedDeptCode").inactive(true).build();
        UCSBSubject s2 = UCSBSubject.builder().subjectCode("testSubjectCode2").subjectTranslation("testSubjectTranslation2").deptCode("testDeptCode2").collegeCode("testCollegeCode2").relatedDeptCode("testRelatedDeptCode2").inactive(true).build();
        ArrayList<UCSBSubject> expectedUCSBSubjects = new ArrayList<>();
        expectedUCSBSubjects.addAll(Arrays.asList(s1,s2));
        when(ucsbSubjectRepository.findAll()).thenReturn(expectedUCSBSubjects);
        
        MvcResult response = mockMvc.perform(get("/api/ucsbsubjects/all")).andExpect(status().isOk()).andReturn();
        
        verify(ucsbSubjectRepository,times(1)).findAll();
        String expectedJSON = mapper.writeValueAsString(expectedUCSBSubjects);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJSON,responseString);   
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubject_post__user_logged_in() throws Exception {
        UCSBSubject expectedUCSBSubject = UCSBSubject.builder().subjectCode("testSubjectCode").subjectTranslation("testSubjectTranslation").deptCode("testDeptCode").collegeCode("testCollegeCode").relatedDeptCode("testRelatedDeptCode").inactive(true).build();
        when(ucsbSubjectRepository.save(eq(expectedUCSBSubject))).thenReturn(expectedUCSBSubject);
        
        MvcResult response = mockMvc.perform(post("/api/ucsbsubjects/post?collegeCode=testCollegeCode&deptCode=testDeptCode&inactive=true&relatedDeptCode=testRelatedDeptCode&subjectCode=testSubjectCode&subjectTranslation=testSubjectTranslation").with(csrf())).andExpect(status().isOk()).andReturn();
        
        verify(ucsbSubjectRepository,times(1)).save(expectedUCSBSubject);
        String expectedJSON = mapper.writeValueAsString(expectedUCSBSubject);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJSON,responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubject__user_logged_in__search_for_UCSBSubject() throws Exception {
        
        UCSBSubject ucsbSubject = UCSBSubject.builder().subjectCode("testSubjectCode").subjectTranslation("testSubjectTranslation").deptCode("testDeptCode").collegeCode("testCollegeCode").relatedDeptCode("testRelatedDeptCode").inactive(true).id(123L).build();
        when(ucsbSubjectRepository.findById(eq(123L))).thenReturn(Optional.of(ucsbSubject));

        MvcResult response = mockMvc.perform(get("/api/ucsbsubjects?id=123")).andExpect(status().isOk()).andReturn();
            
        verify(ucsbSubjectRepository,times(1)).findById(eq(123L));
        String expectedJSON = mapper.writeValueAsString(ucsbSubject);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJSON,responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubject__user_logged_in__search_for_UCSBSubject_that_does_not_exist() throws Exception {
        
        when(ucsbSubjectRepository.findById(eq(123L))).thenReturn(Optional.empty());

        MvcResult response = mockMvc.perform(get("/api/ucsbsubjects?id=123")).andExpect(status().isBadRequest()).andReturn();
        
        verify(ucsbSubjectRepository,times(1)).findById(eq(123L));
        String responseString = response.getResponse().getContentAsString();
        assertEquals("UCSBSubject with id 123 not found",responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubjects__user_logged_in__delete_UCSBSubject_that_does_not_exist() throws Exception {
        when(ucsbSubjectRepository.findById(eq(123L))).thenReturn(Optional.empty());

        MvcResult response = mockMvc.perform(
        delete("/api/ucsbsubjects?id=123")
                .with(csrf()))
        .andExpect(status().isBadRequest()).andReturn();
        
        verify(ucsbSubjectRepository,times(1)).findById(eq(123L));
        String responseString = response.getResponse().getContentAsString();
        assertEquals("UCSBSubject with id 123 not found",responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubjects__user_logged_in__delete_UCSBSubject() throws Exception {
        UCSBSubject ucsbSubject = UCSBSubject.builder().subjectCode("testSubjectCode").subjectTranslation("testSubjectTranslation").deptCode("testDeptCode").collegeCode("testCollegeCode").relatedDeptCode("testRelatedDeptCode").inactive(true).id(123L).build();
        when(ucsbSubjectRepository.findById(eq(123L))).thenReturn(Optional.of(ucsbSubject));

        MvcResult response =  mockMvc.perform(
            delete("/api/ucsbsubjects?id=123")
                    .with(csrf()))
            .andExpect(status().isOk()).andReturn();

            verify(ucsbSubjectRepository, times(1)).findById(123L);
            verify(ucsbSubjectRepository, times(1)).deleteById(123L);
            String responseString = response.getResponse().getContentAsString();
            assertEquals("UCSBSubject with id 123 deleted", responseString);
    }

    // written in by Michael G. for team03 after fixing edit() in UCSBSubjectController.java
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_ucsbsubject() throws Exception {
        // arrange

        UCSBSubject ucsbSubjectOrig = UCSBSubject.builder()
                        .subjectCode("testSubjectCode")
                        .subjectTranslation("testSubjectTranslation")
                        .deptCode("testDeptCode")
                        .collegeCode("testCollegeCode")
                        .relatedDeptCode("testRelatedDeptCode")
                        .inactive(true)
                        .build();
        
        UCSBSubject ucsbSubjectEdited = UCSBSubject.builder()
                        .subjectCode("testSubjectCode")
                        .subjectTranslation("testSubjectTranslation")
                        .deptCode("testDeptCode")
                        .collegeCode("testCollegeCode")
                        .relatedDeptCode("testRelatedDeptCode")
                        .inactive(false)
                        .build();
        
        String requestBody = mapper.writeValueAsString(ucsbSubjectEdited);

        when(ucsbSubjectRepository.findById(eq(67L))).thenReturn(Optional.of(ucsbSubjectOrig));

        // act
        MvcResult response = mockMvc.perform(
                        put("/api/ucsbsubjects?id=67")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .characterEncoding("utf-8")
                                        .content(requestBody)
                                        .with(csrf()))
                        .andExpect(status().isOk()).andReturn();

        // assert
        verify(ucsbSubjectRepository, times(1)).findById(67L);
        verify(ucsbSubjectRepository, times(1)).save(ucsbSubjectEdited); // should be saved with correct user
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

        // written in by Michael G. for team03 after fixing edit() in UCSBSubjectController.java
        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_ucsbsubject_but_inactive_becomes_true() throws Exception {
            // arrange
    
            UCSBSubject ucsbSubjectOrig = UCSBSubject.builder()
                            .subjectCode("testSubjectCode")
                            .subjectTranslation("testSubjectTranslation")
                            .deptCode("testDeptCode")
                            .collegeCode("testCollegeCode")
                            .relatedDeptCode("testRelatedDeptCode")
                            .inactive(false)
                            .build();
            
            UCSBSubject ucsbSubjectEdited = UCSBSubject.builder()
                            .subjectCode("testSubjectCode")
                            .subjectTranslation("testSubjectTranslation")
                            .deptCode("testDeptCode")
                            .collegeCode("testCollegeCode")
                            .relatedDeptCode("testRelatedDeptCode")
                            .inactive(true)
                            .build();
            
            String requestBody = mapper.writeValueAsString(ucsbSubjectEdited);
    
            when(ucsbSubjectRepository.findById(eq(67L))).thenReturn(Optional.of(ucsbSubjectOrig));
    
            // act
            MvcResult response = mockMvc.perform(
                            put("/api/ucsbsubjects?id=67")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();
    
            // assert
            verify(ucsbSubjectRepository, times(1)).findById(67L);
            verify(ucsbSubjectRepository, times(1)).save(ucsbSubjectEdited); // should be saved with correct user
            String responseString = response.getResponse().getContentAsString();
            assertEquals(requestBody, responseString);
        }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_ucsbdate_that_does_not_exist() throws Exception {
        // arrange
        UCSBSubject ucsbEditedSubject = UCSBSubject.builder()
                        .subjectCode("testSubjectCode")
                        .subjectTranslation("testSubjectTranslation")
                        .deptCode("testDeptCode")
                        .collegeCode("testCollegeCode")
                        .relatedDeptCode("testRelatedDeptCode")
                        .inactive(false)
                        .build();

        String requestBody = mapper.writeValueAsString(ucsbEditedSubject);


        when(ucsbSubjectRepository.findById(eq(67L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
                        put("/api/ucsbsubjects?id=67")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .characterEncoding("utf-8")
                                        .content(requestBody)
                                        .with(csrf()))
                        .andExpect(status().isBadRequest()).andReturn();

        // assert
        verify(ucsbSubjectRepository, times(1)).findById(67L);
        String responseString = response.getResponse().getContentAsString();
        assertEquals("UCSBSubject with id 67 not found", responseString);
    }
}
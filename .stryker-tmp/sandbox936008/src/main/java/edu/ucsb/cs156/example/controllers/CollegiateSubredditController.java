package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.CollegiateSubreddit;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.models.CurrentUser;
import edu.ucsb.cs156.example.repositories.CollegiateSubredditRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;

@Api(description = "Collegiate Subreddits")
@RequestMapping("/api/collegiatesubreddits")
@RestController
@Slf4j
public class CollegiateSubredditController extends ApiController{

    public class RecordOrError {
        Long id;
        CollegiateSubreddit record;
        ResponseEntity<String> error;

        public RecordOrError(Long id) {
            this.id = id;
        }
    }

    @Autowired
    CollegiateSubredditRepository collegiateSubredditRepository;

    @Autowired
    ObjectMapper mapper;

    @ApiOperation(value = "List all collegiate subreddits.")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<CollegiateSubreddit> allCollegiateSubReddits() {
        // loggingService.logMethod();
        Iterable<CollegiateSubreddit> subreddits = collegiateSubredditRepository.findAll();
        return subreddits;
    }

    @ApiOperation(value = "Create a new CollegiateSubreddit.")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public CollegiateSubreddit postCollegiateSubreddit(
            @ApiParam("Enter name:") @RequestParam String name,
            @ApiParam("Enter location:") @RequestParam String location,
            @ApiParam("Enter subreddit:") @RequestParam String subreddit) {
        // loggingService.logMethod();
        CurrentUser currentUser = getCurrentUser();
        log.info("currentUser={}", currentUser);

        CollegiateSubreddit collegiateSubreddit = new CollegiateSubreddit();
        collegiateSubreddit.setName(name);
        collegiateSubreddit.setLocation(location);
        collegiateSubreddit.setSubreddit(subreddit);
        CollegiateSubreddit savedCollegiateSubreddit = collegiateSubredditRepository.save(collegiateSubreddit);
        return savedCollegiateSubreddit;
    }

    @ApiOperation(value = "Get a single record by its ID.")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public ResponseEntity<String> getRecordById(
        @ApiParam("id") @RequestParam Long id) throws JsonProcessingException {
        // loggingService.logMethod();

        RecordOrError roe = new RecordOrError(id);

        roe = doesRecordExist(roe);
        if (roe.error != null) {
            return roe.error;
        }

        String body = mapper.writeValueAsString(roe.record);
        return ResponseEntity.ok().body(body);
    }

    public RecordOrError doesRecordExist(RecordOrError roe) {
        Optional<CollegiateSubreddit> optionalRecord = collegiateSubredditRepository.findById(roe.id);

        if(optionalRecord.isEmpty()) {
            roe.error = ResponseEntity
            .badRequest()
            .body(String.format("record %d not found", roe.id));
        }else{
            roe.record = optionalRecord.get();
        }
        return roe;
    }

    @ApiOperation(value = "Delete a record by ID")
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("")
    public ResponseEntity<String> deleteTodo(
            @ApiParam("id") @RequestParam Long id) {
        // loggingService.logMethod();

        RecordOrError roe = new RecordOrError(id);

        roe = doesRecordExist(roe);
        if (roe.error != null) {
            return roe.error;
        }

        collegiateSubredditRepository.deleteById(id);
        return ResponseEntity.ok().body(String.format("record %d deleted", id));

    }

    @ApiOperation(value = "Update a single record.")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("")
    public ResponseEntity<String> putRecordById_admin(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid CollegiateSubreddit incomingRecord) throws JsonProcessingException {
        // loggingService.logMethod();

        RecordOrError roe = new RecordOrError(id);

        roe = doesRecordExist(roe);
        if (roe.error != null) {
            return roe.error;
        }

        // Even the admin can't change the user; they can change other details
        // but not that.

        collegiateSubredditRepository.save(incomingRecord);

        String body = mapper.writeValueAsString(incomingRecord);
        return ResponseEntity.ok().body(body);
    }

}

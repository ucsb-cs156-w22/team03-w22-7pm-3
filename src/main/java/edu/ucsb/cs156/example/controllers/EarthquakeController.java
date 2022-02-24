package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.collections.EarthquakesCollection;
import edu.ucsb.cs156.example.documents.EarthquakeFeatureCollection;
import edu.ucsb.cs156.example.documents.EarthquakeFeature;

import edu.ucsb.cs156.example.services.EarthquakeQueryService;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@Api(description = "Earthquakes")
@RequestMapping("/api/earthquakes")
@RestController
@Slf4j
public class EarthquakeController extends ApiController {

    @Autowired
    EarthquakesCollection earthquakeCollection;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    EarthquakeQueryService earthquakeQueryService;

    @ApiOperation(value = "List all earthquakes")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<EarthquakeFeature> allEarthquakes() {
        Iterable<EarthquakeFeature> earthquakes = earthquakeCollection.findAll();
        return earthquakes;
    }


    @ApiOperation(value = "Get earthquakes a certain distance from UCSB's Storke Tower", notes = "JSON return format documented here: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/retrieve")
    public ResponseEntity<List<EarthquakeFeature>> getEarthquakes(
        @ApiParam("distance in km, e.g. 100") @RequestParam String distance,
        @ApiParam("minimum magnitude, e.g. 2.5") @RequestParam String minMag
    ) throws JsonProcessingException {
        log.info("getEarthquakes: distance={} minMag={}", distance, minMag);
        String result = earthquakeQueryService.getJSON(distance, minMag);
        
        //This is code that wasn't straight up copied:
        EarthquakeFeatureCollection collection = mapper.readValue(result, EarthquakeFeatureCollection.class);
        List<EarthquakeFeature> features = collection.getFeatures();
        
        features = earthquakeCollection.saveAll(features);

        return ResponseEntity.ok().body(features);
    }

    @ApiOperation(value = "Deletes all earthquakes from the earthquakes collection")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/purge")
    public ResponseEntity<String> deleteEarthquakes() {
        earthquakeCollection.deleteAll();
        return ResponseEntity.ok().body(String.format("All earthquakes from the earthquake collection deleted."));
    }
        
    

}

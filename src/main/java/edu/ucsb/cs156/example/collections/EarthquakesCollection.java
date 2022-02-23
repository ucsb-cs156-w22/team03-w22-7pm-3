package edu.ucsb.cs156.example.collections;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.example.documents.EarthquakeFeatureCollection;

@Repository
public interface EarthquakesCollection extends MongoRepository<EarthquakeFeatureCollection, ObjectId> {
 
}
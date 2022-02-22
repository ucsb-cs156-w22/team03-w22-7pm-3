package main.java.edu.ucsb.cs156.example.collections;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import edu.ucsb.cs156.example.documents.EarthquakeFeature;

@Repository
public interface EarthquakesCollection extends MongoRepository<EarthquakeFeature, ObjectId> {
 
}
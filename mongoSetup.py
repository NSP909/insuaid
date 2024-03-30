from pymongo import *
import pymongo
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus
from urllib.parse import quote

load_dotenv()

# MongoDB connection URI with properly escaped username and password
uri=os.getenv("mongo")

# Establish connection to MongoDB
cluster = MongoClient(uri)
db = cluster['data']

schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["user_id", "name", "email"],
        "properties": {
            "user_id": {
                "bsonType": "string",
                "description": "must be an integer and is required"
            },
            "name": {
                "bsonType": "string",
                "description": "must be a string and is required"
            },
            "email": {
                "bsonType": "string",
                "description": "must be a string and is required"
            },
            "data": {
                "bsonType": "object",
                "description": "optional field for additional data"
            }
        }
    }
}

# Create collection with schema validation
collection_name = "users"
collection=db.create_collection(collection_name, validator=schema)
collection.create_index([('email', pymongo.ASCENDING)], unique=True)

# Define sample user data
user_data = {
    "user_id": "1",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "data": {
        "key1": "value1",
        "key2": "value2"
    }
}

# Insert sample user data into the collection
result = db[collection_name].insert_one(user_data)

# Print the inserted document's ID
print("Inserted document ID:", result.inserted_id)
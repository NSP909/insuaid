from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
uri= os.getenv("mongo")
cluster = MongoClient(uri)
db = cluster['data'] 
db.patients.insert_one({"name":"nsp", "age":"20"}) 
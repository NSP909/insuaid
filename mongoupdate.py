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
collection=db['users']
uzer=collection.find_one({'email': 'nspd696969@gmail.com'})
dict=uzer["procedures"]
dict.update({"12900":1799})
update_operation = {
        '$set': {
            'procedures': dict
        }
    }
collection.update_one({'email': 'nspd696969@gmail.com'}, update_operation)
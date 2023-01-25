#!/bin/bash

mongoimport --version

mongoimport --uri "mongodb://$MONGODB_USER:$MONGODB_PASSWORD@$MONGODB_HOST/trellzo?ssl=true&replicaSet=atlas-zfwrvr-shard-0&authSource=admin" --db trellzo -c users --mode upsert --type json --drop --file /mongo_data/user.json --jsonArray

mongoimport --uri "mongodb://$MONGODB_USER:$MONGODB_PASSWORD@$MONGODB_HOST/trellzo?ssl=true&replicaSet=atlas-zfwrvr-shard-0&authSource=admin" --db trellzo -c boards --mode upsert --type json --drop --file /mongo_data/board.json --jsonArray

mongoimport --uri "mongodb://$MONGODB_USER:$MONGODB_PASSWORD@$MONGODB_HOST/trellzo?ssl=true&replicaSet=atlas-zfwrvr-shard-0&authSource=admin" --db trellzo -c notes --mode upsert --type json --drop --file /mongo_data/note.json --jsonArray
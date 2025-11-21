require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Record = require('../models/Record');

async function runImport() {
    try {
        console.log("SCRIPT STARTED");
        console.log('Connecting to MongoDB..');

        await mongoose.connect(process.env.MONGO);
        console.log('Connected..');

        const filePath = path.join(__dirname, '..', 'synthetic_dataset_400.json');

        if(!fs.existsSync(filePath)) {
            console.error(`ERROR : synthetic_dataset_400.json not found at : ${filePath}` );
            process.exit(1);
        }

        console.log(' Loading JSON File..');
        const rawData = fs.readFileSync(filePath,'utf-8');
        let jsonData  = JSON.parse(rawData);

        console.log(`Loaded ${jsonData.length} raw records. `);
        
        jsonData = jsonData.map((item) => {
            Object.keys(item).forEach((key) => {
                //empty string - null 
                if (item[key] === '') item[key] = null;

                // Converting Numeric fields to numbers
                if( ['intensity' , 'likelihood' , 'relevance' , 'start_year' , 'end_year'].includes(key)) {
                    const num = Number(item[key]);
                    item[key] = isNaN(num) ? null : num;
                }
            });
            return item;
        });

        console.log('Cleaning finished importing into MongoDB..');

        //clear old data
        await Record.deleteMany({});
        console.log('Old Data Deleted..');

        //Insert new Data
        let inserted = 0;
        const batchSize = 500;

        while( inserted < jsonData.length ){
            const batch = jsonData.slice( inserted, inserted + batchSize );
            await Record.insertMany(batch);
            inserted += batch.length;
            console.log(`Inserted ${inserted}/ ${jsonData.length} `);
        }

        console.log('Creating Indexes..');
        await Record.collection.createIndex({ topic    : 1 });
        await Record.collection.createIndex({ country  : 1 });
        await Record.collection.createIndex({ sector   : 1 });
        await Record.collection.createIndex({ end_year : 1 });
        await Record.collection.createIndex({ region   : 1 });

        console.log('Import completed successfully!');
        process.exit(0);
    } catch(err) {
        console.error( ' Import error ',err);
        process.exit(1);
    }
    
}
runImport();
 
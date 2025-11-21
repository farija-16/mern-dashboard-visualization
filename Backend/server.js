require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Record = require('./models/Record.js');

const app = express();
app.use(express.json());

/* cors configuration */
const rawOrigins = process.env.FRONTEND_ORIGINS || '';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
 if(allowedOrigins.length == 0 )
 {
    console.warn(' WARNING : FRONTEND-ORIGINS not set. Allowing All Origins (Development mode).');
    app.use(cors());
 } else {
    app.use( 
        cors({
            origin : function(origin, callback) {
                if(!origin) return callback(null,true);
                if(allowedOrigins.includes(origin)) return callback(null,true);
                return callback(new Error(' CORS Blocked: Origin Not Allowed'));
            },
        })
    );
 }

 /* connect to MongoDB atlas */
 const MONGO = process.env.MONGO;
 if (!MONGO) {
    console.error(' ERROR : MONGO Connection string missing in .env');
    process.exit(1);
 }
 mongoose
 .connect(MONGO)
 .then( () => console.log('MONGODB Connected!'))
 .catch((err) => {
    console.error('MONGODB connection error:',err);
    process.exit(1);
 });



 /* Filter Bulider */
 function buildFilter(query) {
    const filter = {};

    const multiFields = [
        'country',
        'region',
        'published',
        'topic',
        'sector',
        'pestle',
        'source',
        'impact'
    ];

    multiFields.forEach((field) => {
        if(query[field]){
            filter[field] = query[field]
        }

        const plural = `${field}s`;
        if(query[plural]){
            const values = String(query[plural])
            .split(',').map((v) => v.trim()).filter(Boolean);
            if(values.length === 1 ) {
                filter[field] = values[0];
            } else if(values.length > 1) {
                filter[field] = { $in : values};
            }
        }
    });
   
    //Numeric ranges 
    const numericFields = ['end_year','start_year','intensity','likelihood','relevance'];
    numericFields.forEach((field) => {
        const gteKey = `${field}_gte`;
        const lteKey = `${field}_lte`;

        if(query[gteKey] || query[lteKey]){
            filter[field] = {};
            if(query[gteKey] ) {
                filter[field].$gte = Number(query[gteKey]);
            }
            if(query[lteKey]) {
                filter[field].$lte =  Number(query[lteKey]);
            }
        }
    });
    //Text Search
    if(query.q) filter.$text = {$search : query.q};

    return filter;
 }

 /* Distinct Endpoint */
 const ALLOWED_DISTINCT = [ 'country','region','impact','topic','sector','pestle','source','published'];

 app.get('/api/distinct/:field', async(req, res) => {
    try {
        const field = req.params.field;
        if(!ALLOWED_DISTINCT.includes(field)){
            return res.status(400).json ({ error : 'Invalid Field '});
        }

        const results = await Record.distinct(field);
        res.json(results.filter(Boolean).sort());
        } catch (err) {
            console.error('distinct error:',err);
            res.status(500).json({error: 'Server error'});
        }
 });

 /* Paginated records */
app.get('/api/records', async(req,res) => {
    // CLEAN EMPTY QUERY PARAMS
    Object.keys(req.query).forEach(key => {
        if (
        req.query[key] === "" ||
        req.query[key] === null ||
        req.query[key] === "null" ||
        req.query[key] === undefined
    ) {
        delete req.query[key];
    }
    });

    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min( 
            Number(req.query.limit) || 50,
            Number(process.env.MAX_LIMIT) || 2000
        );

        const skip = (page - 1) * limit ;

        const sortBy = req.query.sortBy || 'end_year';
        const sortDir = req.query.sortDir === 'asc' ? 1 : -1;

        const filter = buildFilter(req.query);
        const [docs, count] = await Promise.all([
            Record.find(filter).sort({ [sortBy] : sortDir })
            .skip(skip).limit(limit).lean(),
            Record.countDocuments(filter),
        ]);

        res.json({ page, limit, count, totalPages : Math.ceil(count/limit), docs,});
    } catch (err) {
        console.error('records error',err);
        res.status(500).json({error:'Server error'});
    }
});

/*  aggregations (charts) */
app.get('/api/agg/intensity-by-country', async (req,res) => {
    // CLEAN EMPTY QUERY PARAMS
Object.keys(req.query).forEach(key => {
    if (
        req.query[key] === "" ||
        req.query[key] === null ||
        req.query[key] === "null" ||
        req.query[key] === undefined
    ) {
        delete req.query[key];
    }
});

    try {
        const filter = buildFilter(req.query);
        const result = await Record.aggregate ([
            { $match : filter },
            { $match : {intensity : { $ne : null }}},
            {
                $group : {
                    _id : '$country',
                    avgIntensity : { $avg : '$intensity'},
                    count: { $sum : 1},
                },
            },
            { $sort : { avgIntensity : -1}},
            { $limit : 300 },
        ]);
        res.json(result);
    } catch (err) {
        console.error('intensity-by-country error',err);
        res.status(500).json({ error : 'Server error'});
    }
});

//Topic Distribution
app.get('/api/agg/count-by-topic' , async (req,res)=> {
    // CLEAN EMPTY QUERY PARAMS
Object.keys(req.query).forEach(key => {
    if (
        req.query[key] === "" ||
        req.query[key] === null ||
        req.query[key] === "null" ||
        req.query[key] === undefined
    ) {
        delete req.query[key];
    }
});

    try {
        const filter = buildFilter(req.query);
        const result = await Record.aggregate([
            {$match : filter},
            {
                $group : {
                    _id : '$topic',
                    count : { $sum : 1},
                    avgIntensity : {$avg : '$intensity'},
                },
            },
            { $sort : {count : -1 }},
            { $limit : 300}, 
        ]);
        res.json(result);
    } catch (err) {
        console.error ('count-by-topic error',err);
        res.status(500).json ({ error : 'Server error'});
    }
});

//Trend By Year
app.get('/api/agg/count-by-year', async(req,res) => {
    // CLEAN EMPTY QUERY PARAMS
Object.keys(req.query).forEach(key => {
    if (
        req.query[key] === "" ||
        req.query[key] === null ||
        req.query[key] === "null" ||
        req.query[key] === undefined
    ) {
        delete req.query[key];
    }
});

    try {
        const filter = buildFilter(req.query);

        const result = await Record.aggregate([
            { $match : filter},
            {
                $group : {
                    _id : '$end_year',
                    count : { $sum : 1},
                },
            },
            { $sort : {_id : 1}},
        ]);
        res.json(result);
    } catch (err) {
        console.error('trend-by-year error:',err);
        res.status(500).json({ error : 'Server error'});
    }
});

//Scatter (intensity vs likelihood)
app.get('/api/agg/scatter-intensity-likelihood' , async(req,res) => {
    // CLEAN EMPTY QUERY PARAMS
Object.keys(req.query).forEach(key => {
    if (
        req.query[key] === "" ||
        req.query[key] === null ||
        req.query[key] === "null" ||
        req.query[key] === undefined
    ) {
        delete req.query[key];
    }
});

    try {
        const filter = buildFilter(req.query);
        const result = await Record.find(filter, {
            intensity : 1, likelihood : 1, country : 1, topic : 1,
        })
        .limit(2000)
        .lean();
        
        res.json(result);
    } catch (err) {
        console.error('scatter error:',err);
        res.status(500).json({ error :'Server error'});
    }
});

//Agg : kpis
app.get('/api/agg/kpis', async (req,res) => {
    // CLEAN EMPTY QUERY PARAMS
Object.keys(req.query).forEach(key => {
    if (
        req.query[key] === "" ||
        req.query[key] === null ||
        req.query[key] === "null" ||
        req.query[key] === undefined
    ) {
        delete req.query[key];
    }
});

    try {
        const filter = buildFilter(req.query);

        const [totalRecords, totalCountries, avgIntensity, topTopic, topSector,] =await Promise.all([
            Record.countDocuments(filter),
            Record.distinct('country',filter),
            Record.aggregate([
                { $match : {...filter, intensity: {$ne : null}}},
                { $group : {_id : null , avg :{ $avg : '$intensity'}}},
            ]),
            Record.aggregate([
                {$match : filter },
                {$group : { _id : '$topic',count : {$sum : 1 }}},
                {$sort  : {count : -1 }},
                {$limit : 1 },
            ]),
            Record.aggregate([
                { $match : filter },
                { $group : {_id : '$sector',count: { $sum : 1 }}},
                { $sort  : {count : -1 }},
                { $limit : 1 },
            ]),
        ]);
        res.json({
            totalRecords,
            countryCount : totalCountries.filter(Boolean).length,
            avgIntensity : avgIntensity[0]?.avg ?? null,
            topTopic     : topTopic[0] ?? null,
            topSector    : topSector[0] ?? null,
        });
    }catch (err) {
        console.error('kpis error',err);
        res.status(500).json({ error : 'Server error '});
    }
});
/* Filters Options For Dashboard */
app.get('/api/filters/options', async (req,res) => {
    try {
        const endYears       = await Record.distinct('end_year'  , { end_year  : { $ne : null } });
        const topics         = await Record.distinct('topic'     , { topic     : { $ne : null } });
        const sectors        = await Record.distinct('sector'    , { sector    : { $ne : null } });
        const regions        = await Record.distinct('region'    , { region    : { $ne : null } });
        const pestles        = await Record.distinct('pestle'    , { pestle    : { $ne : null } });
        const sources        = await Record.distinct('source'    , { source    : { $ne : null } });
        const publishedDates = await Record.distinct('published' , { published : { $ne : null } });
        const countries      = await Record.distinct('country'   , { country   : { $ne : null } });
        const impacts        = await Record.distinct('impact'    , { impact    : { $ne : null } });

        res.json({
            end_year  : endYears.sort(),
            topic     : topics.sort(),
            sector    : sectors.sort(),
            region    : regions.sort(),
            pestle    : pestles.sort(),
            source    : sources.sort(),
            published : publishedDates.sort(),
            country   : countries.sort(),
            impact    : impacts.sort(),
        });
     } catch (err) {
        console.error("filters/options error.",err);
        res.status(500).json({ error : 'Server Error '});
     }
});
app.get("/api/dashboard", async (req, res) => {
  try {
    // Clean empty query params
    Object.keys(req.query).forEach(key => {
      if (
        req.query[key] === "" ||
        req.query[key] === null ||
        req.query[key] === "null" ||
        req.query[key] === undefined
      ) {
        delete req.query[key];
      }
    });

    const filter = buildFilter(req.query);

    const [topic, country, years, scatter, recordData] = await Promise.all([
      // topic
      Record.aggregate([
        { $match: filter },
        { $group: { _id: '$topic', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // country intensity
      Record.aggregate([
        { $match: filter },
        { $match: { intensity: { $ne: null } } },
        {
          $group: {
            _id: '$country',
            avgIntensity: { $avg: '$intensity' },
            count: { $sum: 1 }
          }
        },
        { $sort: { avgIntensity: -1 } }
      ]),

      // year trend
      Record.aggregate([
        { $match: filter },
        { $group: { _id: '$end_year', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),

      // scatter
      Record.find(filter, {
        intensity: 1,
        likelihood: 1,
        country: 1,
        topic: 1
      })
        .limit(2000)
        .lean(),

      // records
      Record.find(filter).limit(500).lean()
    ]);

    return res.json({
      topic,
      country,
      years,
      scatter,
      records: recordData
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({ error: "Dashboard failed" });
  }
});




/*   Start Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server Running on port ${PORT}`));


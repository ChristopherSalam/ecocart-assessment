EcoCart Sciences Inc

Senior BE Engineer (NodeJS) Assessment

Challenge Part 1 (code)
Context: We are looking to beta-test a new feature for calculating the carbon used when
cooking meals at home. As a POC, we are leveraging this free API -
https://www.themealdb.com/api.php.

Ask: Create a new app/api + endpoint to `get meals using the main ingredient`
Requirements:
- Communicates with / backed-by MealsDB ✅
- Request parameter is a “string” that represents the main ingredient, e.g. “chicken” ✅
- Response is an array of “Meal”s - specified below, with initial values as examples ✅
- Tech: Node / Express / Typescript (anything beyond that is welcome!) ✅
- Testable via Postman ✅
Bonus:
- Some security mechanisms!
- Hosted on public url
    Test Locally -> 

To spin up this repo, clone this repo and then run

```
npm install

npm run dev
```

Example Usage:

http://localhost:8000/?ingredient=Toor%20Dal

```JSON
{
    "message": "These are the Toor Dal meals in our database!",
    "meals": [
        {
            "id": "52785",
            "name": "Dal fry",
            "instructions": "Wash and soak toor dal in approx. 3 cups of water, for at least one hours. Dal will be double in volume after soaking. Drain the water.\r\nCook dal with 2-1/2 cups water and add salt, turmeric, on medium high heat, until soft in texture (approximately 30 mins) it should be like thick soup.\r\nIn a frying pan, heat the ghee. Add cumin seeds, and mustard seeds. After the seeds crack, add bay leaves, green chili, ginger and chili powder. Stir for a few seconds.\r\nAdd tomatoes, salt and sugar stir and cook until tomatoes are tender and mushy.\r\nAdd cilantro and garam masala cook for about one minute.\r\nPour the seasoning over dal mix it well and cook for another minute.\r\nServe with Naan.",
            "tags": [
                "Curry",
                "Vegetarian",
                "Cake"
            ],
            "thumbUrl": "https://www.themealdb.com/images/media/meals/wuxrtu1483564410.jpg",
            "youtubeUrl": "https://www.youtube.com/watch?v=J4D855Q9-jg",
            "ingredients": [
                {
                "ingredient": "Toor dal",
                "measurement": "1 cup"
                },
                {
                "ingredient": "Water",
                "measurement": "2-1/2 cups"
                },
                {
                "ingredient": "Salt",
                "measurement": "1 tsp"
                },
                {
                "ingredient": "Turmeric",
                "measurement": "1/4 tsp"
                },
                {
                "ingredient": "Ghee",
                "measurement": "3 tbs"
                },
                {
                "ingredient": "Chopped tomatoes",
                "measurement": "1 cup"
                },
                {
                "ingredient": "Cumin seeds",
                "measurement": "1/2 tsp"
                },
                {
                "ingredient": "Mustard Seeds",
                "measurement": "1/2 tsp"
                },
                {
                "ingredient": "Bay Leaf",
                "measurement": "2"
                },
                {
                "ingredient": "Green Chili",
                "measurement": "1 tbs chopped"
                },
                {
                "ingredient": "Ginger",
                "measurement": "2 tsp shredded"
                },
                {
                "ingredient": "Cilantro",
                "measurement": "2 tbs "
                },
                {
                "ingredient": "Red Pepper",
                "measurement": "1/2 tsp"
                },
                {
                "ingredient": "Salt",
                "measurement": "1/2 tsp"
                },
                {
                "ingredient": "Sugar",
                "measurement": "1 tsp"
                },
                {
                "ingredient": "Garam Masala",
                "measurement": "1/4 tsp"
                }
            ]
        }
    ]
}
```

Challenge Part 2 (written)

Context: Our beta test was a hit! We now want to scale up to what we anticipate to be
millions of users/requests daily. In order to do this, we'll have to migrate away from
MealsDB

Ask: How might you build this?

- Touch on all parts of the backend system, touching on this like scale, security,
technologies used, strategies implemented.

As constructed this API calls the `https://www.themealdb.com/api/json/v1/1/filter.php?i=` API and then uses these results to call the `https://www.themealdb.com/api/json/v1/1/lookup.php?i=` API on the returned values. This can lead to 10 - 100 API calls per query. Ideally, we should change the structure of the data to be updated routinely and come from a new source that would replace this unpredictable API query process.

I personally would use MongoDB to hold the information for each main ingredient query. This seems like the right choice over SQL based solutions because the query is limited to gets of single values that fit into a key value pair structure, i.e. JSON objects, and updating it does not require advanced queries such as joins or transforms.

To seed and update this database we can use our existing process to update the database once a day (or on some preferred interval), and we could also distribute the A-Z of food items throughout a range as well. The primary security component would involve setting up a separate process to update our MongoDB would post requests to update our datastore following get requests to MealsDB (not prepared in this code challenge) and a security key to be used with this process.Then the data API would instead be changed to return from a persistent query to our MongoDB instance.

Scale will be relatively easy to address because our dataset is finite in nature and can be seeded and updated concurrently, i.e. we can use our primary database to fulfill demand while spinning up separate processes to create clones of our primary database, i.e. we can do a manual horizontal scaling task in addition to asking MongoDB to shard itself to handle extreme demand. We can also setup our code to easily failover and call our secondary MongoDB instances, since these will produce slightly older versions of our recipe list, we can still provide decent service during massive traffic events.

- Be as descriptive as possible, use whichever tools you need to convey
(diagrams, etc)
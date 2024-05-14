const Country = require("country-state-city").Country;
const State = require("country-state-city").State;
const City = require("country-state-city").City;

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb+srv://adarshkumar3088877:rNxHT8BEgh4qwnvS@cluster0.bhnyw6p.mongodb.net/dependentData?retryWrites=true&w=majority",
  function (err, db) {
    if (err) throw err;

    var dbo = db.db("dependentData");

    var countriesBulk = dbo.collection("countries").initializeOrderedBulkOp();

    var countries = Country.getAllCountries();

    countries.forEach((country) => {
      countriesBulk.insert({ name: country.name, short_name: country.isoCode });
    });
    countriesBulk.execute();
    console.log("Countries inserted");

    var statesBulk = dbo.collection("states").initializeOrderedBulkOp();

    var states = State.getAllStates();
    console.log(states);

    states.forEach((state) => {
      statesBulk.insert({
        name: state.name,
        country_short_name: state.countryCode,
        iso_code: state.isoCode,
      });
    });
    statesBulk.execute();
    console.log("States inserted");

    var citiesBulk = dbo.collection("cities").initializeOrderedBulkOp();

    var cities = City.getAllCities();
    cities.forEach((city) => {
      citiesBulk.insert({ name: city.name, state_name: city.stateCode });
    });
    citiesBulk.execute();
    console.log("Cities inserted");
  }
);

import { defineConfig } from "cloesce/config";

const config = defineConfig({
    srcPaths: [
        "./src/data"
    ],
    workersUrl: "http://localhost:5000/api",
    migrationsPath: "./migrations"
});

// import { Weather } from "./src/data/models.cloesce";
//
// Additional configurations to models can happen here,
// such as creating a unique property:
//
// config.model(Weather, (builder) => {
//     builder
//         .unique("dateTime", "location");
// })

export default config;
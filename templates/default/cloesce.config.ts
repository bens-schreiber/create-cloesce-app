import { defineConfig } from "cloesce/config";
import { Weather } from "./src/data/models.cloesce";

const config = defineConfig({
    srcPaths: ["./src/data"],
    workersUrl: "http://localhost:5000/api",
    migrationsPath: "./customDir",
    wranglerConfigFormat: "jsonc",
});

// The Fluent API can be used to further configure models,
// for example to add a unique constraint on the Weather model:
config.model(Weather, builder => {
    builder.unique("dateTime", "location");
});

export default config;

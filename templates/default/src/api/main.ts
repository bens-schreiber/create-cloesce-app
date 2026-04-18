// Here, we import the generated backend code, which includes all the types
// defined in the `schema.clo` file
import * as clo from "@cloesce/backend.js";
import { CfReadableStream } from "@cloesce/backend.js";

// The "cloesce" library provides basic types and utilities for building a Cloesce backend
import { HttpResult } from "cloesce";


// To implement the API routes of a model or service defined in `schema.clo`,
// we can use the `impl` method on it's respective generated namespace.
//
// In addition to defining the routes, `Weather` will inherit all of the static utility methods
// from the generated `Orm`, `Key` and `Source`.
//
// The only place where generated code should be directly used is in `impl` blocks like this.
export const Weather = clo.Weather.impl({
    async uploadPhoto(self, e, s: CfReadableStream) {
        // All models have a `Key` namespace which provides utilities for generating
        // KV and R2 keys for that model.
        const key = this.Key.photo(self.id);
        await e.bucket.put(key, s);
    },

    downloadPhoto(self) {
        // Any method can return an HttpResult, which allows you to specify the 
        // Response status code, body, and headers.
        if (!self.photo) {
            return HttpResult.fail(404, "Photo not found");
        }
        return HttpResult.ok(200, self.photo.body);
    }
});

// `WeatherReport` has no API routes defined.
//
// Instead of using the generated namespace directly, we can still create an implementation with `impl`
// to avoid passing the generated code around the rest of our application.
export const WeatherReport = clo.WeatherReport.impl({});

export default {
    async fetch(request: Request, env: clo.Env): Promise<Response> {
        // preflight
        if (request.method === "OPTIONS") {
            return HttpResult.ok(200, undefined, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }).toResponse();
        }

        // Run Cloesce app
        const app = (await clo.cloesce())
            .register(Weather);

        const result = await app.run(request, env);

        // attach CORS headers
        result.headers.set("Access-Control-Allow-Origin", "*");
        result.headers.set(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );
        result.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return result;
    }
};
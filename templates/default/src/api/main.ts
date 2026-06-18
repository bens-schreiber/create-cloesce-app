// Import the generated backend code, which includes all the types defined in the
// `schema.clo` file.
import * as clo from "@cloesce/backend.js";

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
    async uploadPhoto(self, env, stream) {
        // At runtime, Cloesce "upgrades" the Cloudflare Environment (clo.CfEnv)
        // to a "Cloesce Environment" (clo.Env) which includes helper methods for
        // every binding defined in our schema.
        //
        // For example, the "photos" template in the "Bucket" R2 binding generates
        // a helper for uploading files to R2, which we can call like this:
        await env.Bucket.photos.put(self.id, stream);
    },

    downloadPhoto(self) {
        // Any method can return an HttpResult, which allows you to specify the 
        // Response status code, body, and headers.
        if (!self.photo) {
            return HttpResult.fail(404, "Photo not found");
        }
        return HttpResult.ok(200, self.photo.body);
    },
});

// `WeatherReport` has no API routes defined.
//
// Instead of using the generated namespace directly, (clo.X) create
// an implementation with an empty object, which provides a cleaner interface for
// the rest of the codebase.
export const WeatherReport = clo.WeatherReport.impl({});



export default {
    async fetch(request: Request, env: clo.Env): Promise<Response> {
        const cors = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        };

        if (request.method === "OPTIONS") {
            // A basic CORS preflight handler
            return new Response(null, { headers: cors });
        }

        // The `cloesce` function returns a `CloesceApp` instance,
        // capable of routing an HTTP request to a model implementation.
        //
        // We register any implementations we want to use with `app.register()`.
        const app = clo.cloesce(env);
        app.register(Weather, WeatherReport);

        // The `app.run()` method will:
        // 1. Parses the incoming request URL and matches it to a models method
        // 2. Deserializes and validates the request body and parameters against the schema
        // 3. Hydrates the model instance (if applicable)
        // 4. Dispatches to the respective implementation method (e.g. `Weather.uploadPhoto()`)
        // 5. Returns a Response with the result of the method, serialized according to the schema
        const result = await app.run(request);

        // Set CORS headers on the response
        for (const [key, value] of Object.entries(cors)) {
            result.headers.set(key, value);
        }
        return result;
    },
};

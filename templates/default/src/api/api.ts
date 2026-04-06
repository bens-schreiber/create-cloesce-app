// Here, we import the generated backend code, which includes all the types
// defined in the `schema.clo` file
import * as Cloesce from "@cloesce/backend.js";
import { CfReadableStream } from "@cloesce/backend.js";

// The "cloesce" library provides basic types and utilities for building a Cloesce backend
import { HttpResult } from "cloesce";

// All API routes defined under a model in `schema.clo` are generated under their
// respective models namespace.
//
// To implement an API route, simply extend the generated Api class.
// If not implemented, the route will return a 501 Not Implemented error by default.
class Weather extends Cloesce.Weather.Api {
    async uploadPhoto(self: Cloesce.Weather.Self, e: Cloesce.Env, s: CfReadableStream): Promise<void> {
        // All models have a `KeyFormat` namespace which provides utilities for generating
        // KV and R2 keys for that model.
        const key = Cloesce.Weather.KeyFormat.photo(self.id);
        await e.bucket.put(key, s);
    }

    // Any method can return an HttpResult, which allows you to specify the 
    // Response status code, body, and headers.
    downloadPhoto(self: Cloesce.Weather.Self): HttpResult<CfReadableStream> {
        if (!self.photo) {
            return HttpResult.fail(404, "Photo not found");
        }
        return HttpResult.ok(200, self.photo.body);
    }
}

export default {
    async fetch(request: Request, env: Cloesce.Env): Promise<Response> {
        // preflight
        if (request.method === "OPTIONS") {
            return HttpResult.ok(200, undefined, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }).toResponse();
        }

        // Run Cloesce app
        const app = (await Cloesce.cloesce())
            .register(new Weather());

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
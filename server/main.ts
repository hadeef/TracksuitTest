// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import insertInsight from "./operations/insert-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
//db.exec(createTable);

console.log(`Opening SQLite database at ${dbFilePath}`);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights/create", async (ctx) => {
  try {
    const body = ctx.request.body.json();
    const { brandId, text } = await body;

    const result = insertInsight({ db, brandId, text });
    ctx.response.body = { success: true, message: "Insight created", result };
    ctx.response.status = 201;
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
    console.error(err);
  }
});

router.delete("/insights/delete", (ctx) => {
  const id = Number(ctx.request.url.searchParams.get("id"));
  if (!id) {
    ctx.response.status = 400;
    ctx.response.body = { success: false, error: "Missing or invalid id" };
    return;
  }

  try {
    deleteInsight({ db, id });
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      message: `Insight ${id} deleted`,
    };
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);

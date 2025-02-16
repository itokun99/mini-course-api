import { createResponse, saveFileToStatic } from "@/core";
import { Hono } from "hono";

const app = new Hono();

app.post("/", async (c) => {
  try {
    const body = await c.req.parseBody();
    console.log("body ==>", body["file"]);

    const file = body["file"] as File;

    await saveFileToStatic("testing", file);
    // await Bun.write("./static/" + (file as File)?.name, file);

    return c.json(createResponse("success", "ok"));
  } catch (error: any) {
    return c.json(
      createResponse(
        "error",
        error?.message || "Something went wrong",
        undefined,
        error?.error,
      ),
      error?.statusCode || 500,
    );
  }
});

export default app;

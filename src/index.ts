import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/signup", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    console.log(c.env.DATABASE_URL);

    const body = await c.req.json();

    console.log(body);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
      },
    });

    console.log(newUser);

    return c.json({ success: true });
  } catch (error) {
    console.log("Error", error);
    return c.json({ success: false, error: "Failed to create user" });
  }
});

export default app;

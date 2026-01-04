import express from "express";
import { connectToDatabase, Task } from "@repo/database";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import workspaceRouter from "./routes/workspace.route";
import boardRouter from "./routes/board.route";
import columnRouter from "./routes/column.route";
import taskRouter from "./routes/task.route";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
const app = express();
const server = createServer(app);

dotenv.config();

export type TaskType = {
  _id: string;
  id: string;
  title: string;
  description?: string; // optional
  boardId: string;
  columnId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL! || "http://localhost:3000",
    credentials: true,
  })
);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Attach user info to socket
    (socket as any).userId = (decoded as JwtPayload).userId;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.on("join-board", (boardId: string) => {
    socket.join(boardId);
  });
  socket.on(
    "task-moved",
    async (data: { taskId: string; newColumnId: string; boardId: string }) => {
      socket.to(data.boardId).emit("task-updated", {
        taskId: data.taskId,
        newColumnId: data.newColumnId,
      });
      await Task.findByIdAndUpdate(data.taskId, {
        columnId: data.newColumnId,
      });
    }
  );
  socket.on(
    "task-deleted",
    async (data: { taskId: string; boardSlug: string }) => {
      io.to(data.boardSlug).emit("task-deleted", {
        taskId: data.taskId,
      });
      await Task.findByIdAndDelete(data.taskId);
    }
  );
  socket.on(
    "task-created",
    async (data: { task: TaskType; boardSlug: string }) => {
      const taskCreated = {
        ...data.task,
        //@ts-ignore
        createdBy: socket.userId,
      };

      const newTask = await Task.create(taskCreated);

      io.to(data.boardSlug).emit("task-created", {
        task: newTask,
      });
    }
  );

  socket.on("disconnect", () => {});
});

app.use(express.json());

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI!;

connectToDatabase(MONGO_URI);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/boards", boardRouter);
app.use("/api/columns", columnRouter);
app.use("/api/tasks", taskRouter);

server.listen(PORT, () => {});

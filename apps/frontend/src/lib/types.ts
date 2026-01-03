export type ColumnType = {
  _id: string;
  id: string;
  title: string;
  boardId: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskType = {
  _id: string;
  title: string;
  description?: string;
  boardId: string;
  columnId: string;
};

export type Workspace = {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMember = {
  role: string;
  name: string;
  slug: string;
};

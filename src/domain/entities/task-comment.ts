export interface ITaskComment {
  id: string;
  taskId: string;
  author: TaskCommentUser;
  content: string;
  isCreator: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCommentUser {
  id: string;
  name: string;
  imageUrl?: string;
}

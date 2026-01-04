export interface IMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderImageUrl: string;
  isCreator: boolean;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

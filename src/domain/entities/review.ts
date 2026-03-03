export interface IReview {
  id: string;
  taskId: string;
  projectId: string;
  reviewerId: string;
  contributorId: string;
  rating: number;
  review: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PartialReview = Partial<IReview>;

export interface ICreateReviewRequestDTO {
  userId: string;
  taskId: string;
  rating: number;
  review: string;
}
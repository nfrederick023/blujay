import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateVideo {
  @IsOptional()
  name?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  requireAuth?: boolean;

  @IsOptional()
  isFavorite?: boolean;

  @IsOptional()
  views?: number;

  @IsNotEmpty()
  id: string;
}
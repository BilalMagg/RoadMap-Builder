import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoadmapEntity, RoadmapData } from './roadmap.entity';
import { RoadmapCategory } from './enum/roadmap.enum';

// DTO for creating a roadmap
export class CreateRoadmapDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @IsNotEmpty({ message: 'Category is required' })
  category!: RoadmapCategory;

  @IsOptional()
  @IsObject()
  data?: RoadmapData;
}

// DTO for updating a roadmap
export class UpdateRoadmapDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @IsOptional()
  category?: RoadmapCategory;

  @IsOptional()
  @IsObject()
  data?: RoadmapData;
}

// DTO for roadmap response
export class RoadmapResponseDto {
  id!: string;
  title!: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  category!: RoadmapCategory;
  data!: RoadmapData;

  userId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(entity: RoadmapEntity): RoadmapResponseDto {
    const dto = new RoadmapResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description || undefined;
    dto.status = entity.status || 'DRAFT';
    dto.category = entity.category;
    dto.data = entity.data;

    dto.userId = entity.userId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

// DTO for roadmap list response (without full data)
export class RoadmapListItemDto {
  id!: string;
  title!: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  category!: RoadmapCategory;
  userId!: string;
  author!: {
    id: string;
    username: string;
    avatar?: string;
  };
  likes: number = 0;
  views: number = 0;
  isLiked: boolean = false;
  stepCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
  nodeCount!: number;
  edgeCount!: number;

  static fromEntity(entity: RoadmapEntity): RoadmapListItemDto {
    const dto = new RoadmapListItemDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description || undefined;
    dto.status = entity.status || 'DRAFT';
    dto.category = entity.category;
    dto.userId = entity.userId;

    // Map author from joined user entity
    dto.author = {
      id: entity.user?.id || entity.userId,
      username: entity.user?.username || 'Unknown User',
      avatar: entity.user?.avatar,
    };

    // Default values for engagement metrics (could be added to entity later)
    dto.likes = 0;
    dto.views = 0;
    dto.isLiked = false;

    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.nodeCount = entity.data?.nodes?.length || 0;
    dto.edgeCount = entity.data?.edges?.length || 0;
    dto.stepCount = dto.nodeCount; // Map nodeCount to stepCount

    return dto;
  }
}

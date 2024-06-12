import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SearchEntity } from './entities/search.entity';

@Controller('search')
@ApiTags('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOkResponse({ type: SearchEntity })
  async search(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    // Artificial delay to simulate a slow network
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return new SearchEntity(
      await this.searchService.search(query, page, limit),
    );
  }
}

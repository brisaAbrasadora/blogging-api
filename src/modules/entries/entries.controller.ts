import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EntryService } from './entry.service';
import { Entry } from './entities/entry.entity';
import { CreateEntryDto } from './dto';
import { IdIsGreaterThanZeroGuard } from 'src/common/guards/id-is-greater-zero.guard';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entryService: EntryService) {}

  @Get('all')
  getAllEntries(): Promise<Entry[]> {
    return this.entryService.getAllEntries();
  }

  @UseGuards(IdIsGreaterThanZeroGuard)
  @Get(':id')
  async getEntry(@Param('id', new ParseIntPipe()) id: number): Promise<Entry> {
    const entry: Entry = await this.entryService.getEntry(id);

    if (!entry) {
      throw new NotFoundException('Resource not found');
    }

    return entry;
  }

  @UseGuards(IdIsGreaterThanZeroGuard)
  @Get(':id/all')
  async getAllEntriesByBlog(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<Entry[]> {
    return await this.entryService.getAllEntriesByBlog(id);
  }

  @Post()
  async createEntry(
    @Request() req,
    @Body() entry: CreateEntryDto,
  ): Promise<Entry> {
    return this.entryService.createEntry(entry, req.user.id);
  }

  @Delete(':id')
  async deleteEntry(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<void> {
    return await this.entryService.deleteEntry(id);
  }
}

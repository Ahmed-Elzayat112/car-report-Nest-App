import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/user/user.entity';
import { GetEstimateDto } from 'src/user/dto/get-estimate.dto';
@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({ make, model, lat, lng, mileage, year }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make= :make', { make })
      .andWhere('model= :model', { model })
      .andWhere('lng- :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat- :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year- :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage-:mileage', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    console.log(user);
    console.log(report);
    return this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOneBy({ id });
    if (!report) throw new NotFoundException('Unapproved report not found');
    report.approved = approved;
    return this.repo.save(report);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MemphisService } from 'memphis-dev/nest';

@Injectable()
export class BrokerService {
  consumer;
  producer;

  constructor(
    private configService: ConfigService,
    private memphisService: MemphisService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.memphisService.connect({
        host: this.configService.get<string>('MEMPHIS_HOST'),
        username: this.configService.get<string>('MEMPHIS_USERNAME'),
        connectionToken: this.configService.get<string>('MEMPHIS_TOKEN'),
      });

      this.consumer = await this.memphisService.consumer({
        stationName: '',
        consumerName: '',
        consumerGroup: '',
      });

      this.producer = await this.memphisService.producer({
        stationName: '',
        producerName: '',
      });
    } catch (error) {
      console.error(error);
      this.memphisService.close();
    }
  }
}

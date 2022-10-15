import { Controller, Get } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  hello() {
    return {
      msg: 'nest4noobs',
    };
  }
}

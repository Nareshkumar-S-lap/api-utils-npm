import { Request } from '@hapi/hapi';

interface HeaderBuilderOptions {
  withAuth?: boolean;
}

class HeaderBuilder {
  private request: Request;
  private headers: { [key: string]: string };
  private options: HeaderBuilderOptions;

  constructor(request: Request, options: HeaderBuilderOptions = {}) {
    this.request = request;
    this.headers = {};
    this.options = options;
  }

  async build(): Promise<{ [key: string]: string }> {
    return this.headers;
  }
}

export default HeaderBuilder;

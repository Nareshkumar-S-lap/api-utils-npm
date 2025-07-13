import HeaderBuilder from "./headerBuilder";
import { Request } from "@hapi/hapi";

export class RequestHelper {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  getParam(key: string): any {
    return this.request.params[key];
  }

  getAllParams(): { [key: string]: any } {
    return this.request.params;
  }

  getHeaders(): { [key: string]: any } {
    return this.request.headers;
  }

  getHeaderParam(key: string): any {
    return this.request.headers[key];
  }

  getPayload(): any {
    return this.request.payload;
  }

  getQueryString(): string {
    if (this.request.url && this.request.url.search && this.request.url.search !== "") {
      return this.request.url.search.substring(1);
    }
    return "";
  }

  getQueryParam(key: string): any {
    return this.request.query[key];
  }

  getHeaderBuilder(): HeaderBuilder {
    return new HeaderBuilder(this.request);
  }

  setParam(key: string, value: any): void {
    this.request.params[key] = value;
  }

  getUser(): any {
    return this.request.auth && this.request.auth.artifacts && this.request.auth.artifacts.user;
  }
}

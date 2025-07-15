import { performance } from "perf_hooks";
import { logger } from "@common/logger";

class Performance {
  private service: string;
  private start: number;

  constructor(service: string) {
    this.service = service;
    this.start = performance.now();
    logger.debug({ service: this.service, event: "start", start: this.start });
  }

  stop(): void {
    const end = performance.now();
    logger.debug({
      service: this.service,
      event: "end",
      duration: end - this.start,
      start: this.start,
      end
    });
  }
}

export default Performance;

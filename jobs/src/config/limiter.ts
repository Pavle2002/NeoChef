import Bottleneck from "bottleneck";

export const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000, // 1 request per second
});

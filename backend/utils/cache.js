const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = await redis.get(key);

  if (cachedData) {
    return res.json(JSON.parse(cachedData));
  }

  res.sendResponse = res.json;
  res.json = async (body) => {
    await redis.setex(key, 3600, JSON.stringify(body)); // Cache for 1 hour
    res.sendResponse(body);
  };

  next();
};

module.exports = { redis, cacheMiddleware };

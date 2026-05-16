const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis kết nối thành công!");
  } catch (err) {
    console.log("Redis chưa được bật.");
  }
})();

module.exports = redisClient;

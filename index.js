const { nanoid } = require('nanoid');
const Redis = require('ioredis');

class TinyLink {
    constructor(opts) {
        if (!opts.client || !(opts.client instanceof Redis)) {
            throw new Error('An ioredis instance must be provided');
        }
        this.prefix = opts.prefix == null ? "tiny-link:" : opts.prefix
        this.redis = opts.client;
        this.ttl = opts.ttl || 0
    }

    async shortenUrl(originalUrl, ttlInSeconds) {
        ttlInSeconds = ttlInSeconds || this.ttl || 0;
        try {
            const identifier = nanoid();
            let key = this.prefix + identifier;
            if (ttlInSeconds) {
                await this.redis.setex(key, ttlInSeconds, originalUrl);
            } else {
                await this.redis.set(key, originalUrl);
            }
            return identifier;
        }
        catch (error) {
            throw new Error(`Failed to shorten URL: ${error && error.message}`)
        }
    }

    async getOriginalUrl(identifier) {
        try {
            let key = this.prefix + identifier;
            const originalUrl = await this.redis.get(key);
            if (!originalUrl) {
                throw new Error(`${identifier} not found`);
            }
            return originalUrl;
        }
        catch (error) {
            throw new Error(`Failed to get shorten URL: ${error && error.message}`)
        }
    }

    async deleteKey(identifier) {
        try {
            const key = this.prefix + identifier;
            const result = await this.redis.del(key);
            return result > 0;
        }
        catch (error) {
            throw new Error(`Failed to delete shorten URL: ${error && error.message}`)
        }
    }

    async flushKeys() {
        try {
            const keys = await this.redis.keys(`${this.prefix}*`);
            if (keys.length === 0) {
                return 0;
            }
            const pipeline = this.redis.pipeline();
            keys.forEach((key) => {
                pipeline.del(key);
            });
            const results = await pipeline.exec();
            const flushedCount = results.filter(([err, result]) => result === 1).length;
            return flushedCount;
        }
        catch (error) {
            throw new Error(`Failed to flush keys ${error && error.message}`)
        }
    }
}

module.exports = {TinyLink};

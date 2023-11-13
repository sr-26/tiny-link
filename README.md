# LiteLink

LiteLink is a simple Node.js module that provides URL shortening functionality using Redis as the backend storage.

## Installation

To use LiteLink in your Node.js project, install it via npm:

```bash
npm install lite-link
```


## Use Case: Shortening URLs for Social Media Sharing

**Scenario**:
You are developing a web application that allows users to share content on various social media platforms. However, the URLs of the shared content are often long and cumbersome. To enhance the user experience and improve the aesthetics of shared posts, you decide to implement a URL shortening feature using LiteLink.

Example:
Step 1: Initialize LiteLink

```javascript
const { LiteLink } = require('lite-link');
const Redis = require('ioredis');

// Create an ioredis instance
const redisClient = new Redis();

// Create an instance of LiteLink with your Redis client
const liteLink = new LiteLink({ client: redisClient });
```

Step 2: Shorten URLs for Social Media Sharing
```javascript
// Original long URL of the shared content
const longUrl = 'https://your-website.com/articles/article-title';

// Shorten the URL using LiteLink
const shortKey = await liteLink.shortenUrl(longUrl);

// Construct the short URL to be shared on social media
const shortUrl = `https://your-short-domain/${shortKey}`;

// Now, users can share the short URL on social media platforms
console.log('Shortened URL for Social Media:', shortUrl);
// Example Output: "hR-5deQs"
```

Step 3: Handling Redirects
```javascript
// Extract the short key from the incoming request
const shortKeyFromRequest = /* Extract the short key from the request parameters */;

// Retrieve the original URL using LiteLink
const originalUrl = await liteLink.getOriginalUrl(shortKeyFromRequest);

// Redirect the user to the original URL
// This depends on your server framework (e.g., Express, Koa)
// Example using Express:
res.redirect(301, originalUrl);
```

In this use case, LiteLink is utilized to make shared content URLs more user-friendly on social media. The process involves shortening the original long URL into a compact and memorable short key. When users click on the short URL, LiteLink helps retrieve the original URL, allowing for a seamless redirect to the actual content.

This use case demonstrates how LiteLink can enhance the user experience by simplifying URLs, making them more suitable for sharing on social media platforms where character limits may apply.


## Usage

```javascript
const { LiteLink } = require('lite-link');
const Redis = require('ioredis');

// Create an ioredis instance
const yourRedisClient = new Redis();

// Create an instance of LiteLink with your Redis client
const liteLink = new LiteLink({ client: yourRedisClient });

// Shorten a URL
const shortKey = await liteLink.shortenUrl('https://example.com');

// Get the original URL
const originalUrl = await liteLink.getOriginalUrl(shortKey);

// Clear a specific key
const result = await liteLink.deleteKey(shortKey);

// Flush all keys with a specific prefix
const flushResult = await liteLink.flushKeys();

```

###### Configuration Options

LiteLink supports the following configuration options:

- client: An instance of the ioredis client for connecting to Redis.
- prefix (optional): A prefix to be added to all keys in Redis. Default is "lite-link:".
- ttl (optional): Time-to-live for keys in seconds. Default is 0 (no TTL).

###### Methods

**1. shortenUrl(originalUrl, ttlInSeconds)**

Shortens a URL and returns the generated short key.

- originalUrl: The original URL to be shortened.
- ttlInSeconds (optional): Time-to-live for the short URL in seconds. Overrides the default TTL.

**2. getOriginalUrl(shortKey)**

Retrieves the original URL for a given short key.

- shortKey: The short key to look up.

**3. deleteKey(shortKey)**

Clears (deletes) a specific key from Redis.

- shortKey: The short key to clear.

**4. flushKeys()**

Clears (deletes) all keys with the configured prefix from Redis.

Returns a message indicating the number of keys flushed.



## License

MIT

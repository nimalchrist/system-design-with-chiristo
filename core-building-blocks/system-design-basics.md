# Master System Design

## Phase 1 — Foundations
### OSI Layers, DNS, APIs, Load Balancing, Caching, Databases

---

### 1. OSI Layers (Open System Interconnect)

1. **Physical Layer** — Wires and binary signals
2. **Data Link Layer** — MAC addresses, switches
3. **Network Layer** — IP addresses and routing
4. **Transport Layer** — TCP, UDP, and port numbers
5. **Session Layer** — Connections, cookies, and maintaining sessions
6. **Presentation Layer** — Data formats (JSON, SSL/TLS encryption)
7. **Application Layer** — APIs, HTTP, DNS, Browsers

**Example:** Imagine sending a message via WhatsApp. WhatsApp represents the application logic utilizing the application layer (HTTP, WebSockets). The application layer relies on the transport layer to ensure data delivery. The transport layer contains IP addresses and port numbers for precise routing, depending on the network layer. The network layer depends on the data link and physical layers for successful transmission. On the receiving end, this process reverses to deliver the message.

---

### 2. DNS (Domain Name System)

DNS is part of the application layer. Its main purpose is to translate entered web addresses into their corresponding IP addresses.

Four major components:
1. **DNS Resolver** — Tries to find the entered IP address (ISP or Google DNS, Cloudflare)
2. **Root DNS Servers** — Top-level directory of the entire internet. Not owned by any company. Managed by ICANN.
3. **TLD Servers** — Nothing domain-specific servers (.it server, .com server)
4. **Authoritative DNS Server**

---

### 3. API to OSI Layer

Consider: `GET https://api.netflix.com/movies`

- Called through the application layer using HTTPS
- DNS tries to find the IP address for the domain
- Once the IP is found, it is transferred to the transport layer
- A handshake occurs between the calling and called systems
- Once acknowledgment is received, the requested resource is transmitted via the network layer
- Data link and physical layers handle the actual transmission
- Data is received back at the application layer

---

### 4. Load Balancing

A load balancer is a **traffic director** that distributes incoming requests across multiple servers so no single server is overloaded.

**Two main types:**

1. **Layer 4 (Transport Layer) LB** — AWS NLB, Azure LB, GCP TCP/UDP LB
   - Routes data based on IP + port
   - High performance

2. **Layer 7 (Application Layer) LB** — AWS ALB, Azure API Gateway, HTTPS LB
   - Routes based on URL paths, headers, cookies, request body
   - Smarter but slightly slower

**Why Layer 7 is needed (Netflix `/movies` example with 5M requests/sec):**
- User-specific personalization routing
- Some users see a cached list; some get recomputed personalized ranking
- Some regions hit different backend clusters
- Premium users may hit servers with higher throughput
- A/B testing
- Security checks (blocking specific UserAgent)
- Rate limiting
- L4 LB **cannot** do any of these

---

### 5. Caching

A cache is a **fast, temporary storage** for frequently accessed data.

> "Do I really need to recompute or re-fetch this data every time?"

**Caching at different layers:**
1. Client-side cache (Browser, mobile apps)
2. CDN cache (CloudFront, Cloudflare)
3. LB cache / reverse proxy cache
4. Application-level cache (Redis, MemoryCache)
5. Database cache (Query cache, Buffer cache)

**Cache hit vs Cache miss:**
- Always create cache data with a high hit ratio. If the cache hit rate is low, there is no point in having a cache.

**Cloud services mapping:**
- AWS: CDN → CloudFront, App Cache → ElastiCache
- Azure: CDN → Azure Front Door, App Cache → Azure Cache for Redis
- GCP: CDN → Cloud CDN, App Cache → Memorystore

**Caching patterns:**

```
a. Cache-Aside (most common)
   Request → Cache
      ↓ miss
   Database → Cache → Response

b. Write-Through Cache
   Write → Cache → Database

c. Write-Back (Write-Behind)
   Write → Cache → (later) Database
```

**Cache Eviction Policies:**
- LRU — Least Recently Used
- LFU — Least Frequently Used
- TTL — Time To Live

---

### 6. Database for System Design

A database is the **source of truth** for a system.

- Primary aspect: store data consistently and survive restarts
- Databases can't scale like stateless services:
  - Writes are coordinated (may lead to write conflicts)
  - Data consistency matters
  - Disk I/O is slow
  - Locks and indexes exist

**Read-heavy vs Write-heavy systems:**

| Type | Example | Design Implications |
|------|---------|-------------------|
| Read-heavy | Product catalog page | Cache aggressively, replicate reads, optimize query speed |
| Write-heavy | Chat message storage, logging | Fast writes, append-only patterns, eventual consistency acceptable |

**Choosing SQL vs NoSQL:**

| | SQL | NoSQL |
|---|---|---|
| Best for | Relationships matter, transactions matter, consistency matters | Data shape varies, high write throughput, scale over strict consistency |
| Trade-offs | Schema rigidity, harder to scale | Weaker consistency, more app logic responsibility |

---

### 7. Latency, Throughput, Availability, and Reliability

#### 1. Latency
> Time taken for one request to complete.

Measured in:
- Milliseconds (ms)
- **p95, p99 latency** — 95% or 99% of requests are faster than this value

#### 2. Throughput
> Number of requests a system can handle per unit time.

Measured in: RPS (requests/sec), TPS (transactions/sec)

**How components affect Latency & Throughput:**
- **Caching** — Reduces latency, increases throughput (fewer DB hits)
- **Load Balancers** — Slightly increase latency (extra hop), greatly increase throughput (parallelism)
- **Database** — High latency, low throughput (compared to cache)
- **Concurrency** — Increases throughput, slightly affects latency if overloaded

#### 3. Availability
> Usually expressed as a percentage of uptime.

| Availability | Downtime/year |
|---|---|
| 99% | ~3.6 days |
| 99.9% (three 9s) | ~8.7 hours |
| 99.99% | ~52 minutes |

**Common Single Points of Failure (SPOF):**
- One API server
- One database instance
- One availability zone / region
- One load balancer

**How to improve availability:**
- Redundancy
- Failover
- Health checks

#### 4. Reliability
> Does the system do the right thing under failure?

A system can be:
- Available but unreliable (returns wrong data)
- Reliable but temporarily unavailable (fails safely)

**What breaks reliability:**
- Partial failures, network timeouts, duplicate requests, downstream failures

**Core reliability techniques:**

1. **Timeouts** — Never wait forever. Fail fast. Prevent thread exhaustion.
2. **Retries** (carefully) — Only when operation is idempotent and backoff is applied.
3. **Idempotency** — Same request sent twice → same result.
4. **Queues** — Buffer traffic, allow retries, isolate failures.
5. **Graceful Degradation** — When one system fails (e.g. recommendations fail but video playback continues), show partial data, disable non-critical features, keep core system usable.

---
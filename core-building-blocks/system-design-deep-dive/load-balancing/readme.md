# Load Balancer (Deep Dive)

> A Load Balancer sits between clients and backend servers and decides **which server should handle each request**.

```
Client → DNS → Load Balancer → Backend Servers
```

**Types:**
1. **Application Layer LB** (HTTP/HTTPS, URLs, Headers, Cookies, QueryParams) — Modern web systems, microservices
2. **Transport Layer LB** — Works on IP + Port, Protocol-aware (TCP, UDP)

**LB in popular cloud providers:**
- **AWS** — EC2 Load Balancers (Network LB, Application LB, Gateway LB), Lightsail Load Balancers
- **GCP** — Load Balancing (ALB, NLB)
- **Azure** — API Management, Application Gateway (Layer 7 and 4), Azure Front Door (CDN + Layer 7 LB), Load Balancer (Layer 4)

**LB Algorithms:**

| Algorithm | Description | Notes |
|-----------|-------------|-------|
| Round Robin | Requests distributed sequentially | Simple; no awareness of server load; assumes all servers are equal |
| Least Connections | Route to server with fewest active connections | Better for long-lived requests; requires tracking live connections |
| Weighted Round Robin | Servers have weights; more powerful servers get more traffic | Good when servers are not identical |
| Hash-Based Routing | Route based on hash (userId, sessionId, IP) | Ensures same client hits same server |

**Sticky Sessions:**
- If session data is stored in memory and a request hits a different server, the session breaks.
- Sticky sessions at the LB level solve this — but come with trade-offs.

---
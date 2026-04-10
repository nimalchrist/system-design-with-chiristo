# AWS Basics

## AWS Global Services
- IAM (Identity and Access Management)
- Route 53 (DNS Service)
- CloudFront (Content Delivery Network)
- WAF (Web Application Firewall)

**Note**
- Global services are not tied to a specific region.
- Some global services still store data in regional resources (example: CloudTrail logs stored in S3).

---

## AWS Region Scoped Services
- Most AWS services are region scoped.
- Each region has its own isolated resources.
- Examples: EC2, S3, RDS, VPC, Lambda, DynamoDB.

---

## IAM (Identity and Access Management)
- Global service for authentication and authorization.
- Manages users, groups, roles, and policies.
- Controls access to AWS resources.
- All AWS API calls are evaluated by IAM.


### IAM Users
- Represent human users or long-term programmatic access.
- Can belong to multiple groups.


### IAM Groups
- Collection of IAM users.
- Groups cannot contain other groups.
- Permissions assigned to a group apply to all users in the group.


### IAM Policies
- JSON documents defining permissions.
- Follow the principle of least privilege.
- Can be attached to users, groups, or roles.

**Policy Types**
- Inline Policies
- Managed Policies (AWS-managed or Customer-managed)


### IAM Policy Structure

**Policy contains**
- Version
- Id (optional)
- Statement(s)

**Statement contains**
- Sid (optional)
- Effect (Allow or Deny)
- Action
- Resource
- Condition (optional)

**Note**
- `Principal` is used in resource-based policies.
- Identity-based policies do not require `Principal`.

**Example**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBuckets",
      "Effect": "Allow",
      "Action": "s3:ListAllMyBuckets",
      "Resource": "*"
    }
  ]
}
```

### IAM Roles
- Do not have long-term credentials.
- Provide temporary credentials via STS (Security Token Service).
- Used by:
    - AWS services (EC2, Lambda, ECS, etc)
    - External identities (OIDC, SAML, cross-account access)
    - **Example**
        - EC2 role accessing S3 without storing access keys.

### IAM Security Tools
- IAM Credentials Report (Account Level)
- IAM Access Analyser (User level)

### IAM Best Practices
- Use least privilege
- Rotate credentials
- Use MFA
- Use temporary credentials
- Use IAM roles

### IAM Section Summary
- Users: mapped to a physical user, has a password to access AWS console
- Groups: collection of users(only users, no roles)
- Policies: JSON documents that define permissions for users and groups
- Roles: provide temporary credentials to AWS services
- Security: MFA + Password policy
- AWS CLI: manage AWS services using command line interface
- AWS SDK: manage AWS services using programming languages
- Access Keys: Access AWS using CLI or SDK
- Audit: Using IAM Access Analyser and IAM Credentials Report

---

## EC2 (Elastic Compute Cloud)

### EC2 Basics
- EC2 (Elastic Compute Cloud) provides resizable virtual servers in the cloud.
- EC2 instances run inside a **VPC** and are launched in a **specific Availability Zone (AZ)**.
- An EC2 instance is composed of:
  - Instance Type (CPU, memory, networking)
  - AMI (OS + preinstalled software)
  - Storage (EBS or instance store)
  - Network configuration (VPC, subnet, security groups)
  - Key pair (for SSH access)

**Key Points**
- EC2 is a **region-scoped service**.
- Instances are **AZ-specific**, not regional.
- Stopping an instance:
  - Keeps the EBS root volume (by default)
  - Changes the public IP (unless Elastic IP is used)
- Terminating an instance:
  - Deletes the instance
  - Deletes the root volume if `DeleteOnTermination = true`

### EC2 Instance Types [Learn More](https://aws.amazon.com/ec2/instance-types/)

#### General Purpose
- Families: `t`, `m`
- Balanced compute, memory, and networking
- Use cases:
  - Web servers
  - Application servers
  - Small to medium databases
- `t` instances are **burstable** (CPU credits)

#### Compute Optimized
- Families: `c`
- High CPU-to-memory ratio
- Use cases:
  - Batch processing
  - Media transcoding
  - High-performance computing (HPC)
  - Game servers
  - Data processing workloads

#### Memory Optimized
- Families: `r`
- High memory-to-CPU ratio
- Use cases:
  - In-memory databases (Redis, Memcached)
  - In-memory analytics
  - Real-time big data processing

#### Storage Optimized
- Families: `d`, `h`
- High disk throughput and IOPS
- Use cases:
  - Data warehousing
  - Log processing
  - Distributed file systems
  - Large-scale storage workloads

### Security Groups

- Security Groups act as a **virtual firewall** for EC2 instances.
- They control **inbound and outbound traffic**.
- Security Groups are **stateful**:
  - If inbound traffic is allowed, return traffic is automatically allowed.
- Rules are **allow-only** (no explicit deny rules).
- Security Groups are evaluated **at the instance level**.

**Relationship Between EC2 and Security Groups**
- An EC2 instance must be associated with **at least one security group**.
- Multiple security groups can be attached to a single EC2 instance.
- A single security group can be attached to **multiple EC2 instances**.
- Security group changes take effect **immediately**.

**What Security Groups Filter**
- Source / Destination IP
- Protocol (TCP, UDP, ICMP)
- Port range

### Classic Ports to Know (Security Groups)

1. **22** – SSH  
   - Secure shell access to Linux instances
2. **21** – FTP  
   - File Transfer Protocol (unencrypted)
3. **22** – SFTP  
   - Secure File Transfer Protocol (over SSH)
4. **80** – HTTP  
   - Unencrypted web traffic
5. **443** – HTTPS  
   - Encrypted web traffic
6. **3389** – RDP  
   - Remote Desktop Protocol for Windows instances
7. **25** – SMTP  
   - Email traffic


### Amazon EC2 Purchasing Options

#### 1. **On-Demand Instances** (Pay as you go)

* Pay only for what you use
  * **Per second**: Linux, Windows
  * **Per hour**: macOS (minimum 24-hour allocation)
* No long-term commitment
* No upfront payment
* Most expensive option per unit time
* Ideal for:
  * Unpredictable workloads
  * Short-term or spike workloads
  * Testing and development

#### 2. **Reserved Instances (RIs)** (Commit for 1 or 3 years)

* Commit to:
  * Instance type
  * Region (Regional or Zonal)
  * OS
  * Tenancy
* **Zonal RIs** provide capacity reservation in a specific AZ
* **Regional RIs** provide billing discount only (no capacity guarantee)
* 1-year or 3-year commitment
* Significant discounts (up to ~75%)
* Best for steady, predictable workloads
*  **Types**
   * **Standard Reserved Instances**
   * Highest discount
   * Can be **bought and sold** on the AWS Marketplace
   * Cannot change instance attributes
   * **Convertible Reserved Instances**
   * Slightly lower discount
   * Can be **exchanged** for different instance families, OS, tenancy, or scope
   * **Cannot be sold** on the AWS Marketplace

##### 3. **Spot Instances** (Use spare AWS capacity)

* Use unused EC2 capacity at very low prices
* Up to **90% discount**
* AWS can reclaim instances with short notice
* Not reliable for critical workloads
* Ideal for **fault-tolerant and stateless workloads**, such as:
  * Batch processing
  * Data analysis
  * Image and video processing
  * Distributed workloads
  * Workloads with flexible start and stop times

#### 4. **Savings Plans**

* Commit to a consistent amount of usage (for example, `$10/hour`)
* 1-year or 3-year commitment
* Usage beyond commitment is charged at On-Demand rates
* Discounts similar to Reserved Instances
* **Types**
   * **Compute Savings Plans**
   * Most flexible
   * Works across:
      * Instance families
      * Instance sizes
      * Regions
      * OS
      * Tenancy
   * **EC2 Instance Savings Plans**
   * Locked to:
      * Instance family
      * Region
      * OS
      * Tenancy
   * Flexible across instance sizes within the same family
* Ideal for predictable workloads without wanting to manage RIs

#### 5. **Dedicated Hosts**

* Entire **physical server** dedicated to your use
* Full control over host-level configuration
* Required for certain:
  * Compliance requirements
  * Licensing models (BYOL)
* Available as On-Demand or Reserved
* Most expensive EC2 option
* Recommended when host-level visibility or control is mandatory

#### 6. **Dedicated Instances**

* Instances run on hardware dedicated to a single customer
* No control at the host level
* AWS can move instances to different physical hosts after stop/start
* Cheaper than Dedicated Hosts
* Available as On-Demand or Reserved
* Used for compliance scenarios where host control is not required

#### 7. **Capacity Reservations**

* Reserve EC2 capacity in a **specific Availability Zone**
* No long-term commitment
* No billing discounts
* Charged at **On-Demand rates**, even if unused
* Guarantees capacity availability
* Useful for:
  * Short-term, uninterrupted workloads
  * AZ-specific deployments
  * Events or planned spikes


#### EC2 Purchasing Options - Resort Analogy

1. **On-Demand**
   * Walk in and stay whenever you like
   * Pay full price for every day you stay

2. **Reserved Instances**
   * Book a room for 1 or 3 years
   * Cheaper per day
   * You pay even if you don’t stay

3. **Spot Instances**
   * Bid for a discounted room
   * Cheap, but you can be kicked out anytime

4. **Savings Plans**
   * Prepay for a certain amount of stay per day
   * You can switch room types later

5. **Dedicated Hosts**
   * Rent the entire building
   * Expensive, but fully yours

6. **Capacity Reservations**
   * Book a room at full price
   * Pay even if you never show up


### EC2 Placment Groups

- Some times we need to deploy multiple instances in a place where we need to chooose. For that placement groups are used.
- Types: 
  - **Cluster** - Clusters the intstances in a single AZ
    - Pros: Low latency, high bandwidth between the instances
    - Cons: Single point of failure
    - BestUsecase: High performance computing (HPC), Big data analytics
  - **Spread** - Spreads the instances across multiple AZs and each instance is on a different hardware
    - Pros: High availability and reduced risk of simultaneous failures
    - Cons: High latency, low bandwidth and 7 instances per AZ per placement group
    - BestUsecase: Critical workloads that require high availability
  - **Partition** - Partitions the racks across multiple AZs and each partition is on a different hardware
    - Each partition can have 100s of instances and each partition is isolated from other partitions
    - 7 partitions per AZ per placement group
    - Pros: High availability and reduced risk of simultaneous failures
    - Cons: High latency, low bandwidth
    - BestUsecase: Critical workloads that require high availability


### ENI (Elastic Network Interfaces)
- ENI is a virtual network interface that can be attached to an EC2 instance.
- It has a private IP address, public IP address, and security groups.
- It has the following attributes:
   - Primary private IPv4 and one or more secondary private IPv4 addresses
   - One elastic IP address (IPv4)
   - One public IPv4
   - One or more security groups
   - A Mac address
- It can be moved from one EC2 instance to another EC2 instance.
- It can be attached to multiple EC2 instances at a time.   
- Bound to specific AZ

### EC2 Hibernation
- Hibernation is a feature that allows you to save the state of an EC2 instance to disk and then stop the instance.
- When the instance is started again, it will resume from where it left off.
- It is only available for EBS-backed encrypted storage instances.
- It is not available for Spot Instances.
- It is not available for instances with more than 150 GB of RAM.

### EC2 Instance Storage

1. **EBS (Elastic Block Store)**
  - EBS is a network-attached storage that is attached to an EC2 instance.
  - It allows to persist data even after the instance is stopped.
  - They are bound to specific AZ
  - Analogy: Think of it like a network USB stick
  - It is a network drive not physical drive. So latency will be high
  - Have a provisioned capacity (IOPS, GBs)
  - **EBS Snapshots**
    - EBS snapshots are incremental
    - First snapshot captures the full volume data, subsequent snapshots only store the changes
    - Subsequent snapshots only store the changes
  - **EBS Snapshot Features**
    - EBS Snapshot Archive - Moving the snapshot to an archive tier that is 75% cheaper and takes 24 to 72hrs for restoring the archive
    - EBS Recycle Bin - Protect from accidental deletion
    - Fast Snapshot Restore - Restoring the snapshot to a new volume in minutes (expensive)

  - **EBS Volume Types**
    - General Purpose (gp2, gp3) - balanced performance and cost
    - IO Optimized (io1, io2) - high performance ssd
    - Throughput Optimized (st1) - low cost hdd
    - Cold HDD (sc1) - lowest cost hdd
    - Characterized by Size, IOPS, Throughput
    - Only gpX, ioX supports booting

  - **EBS Volume Types Usecases**
    - General Purpose (gp2, gp3) - Boot volumes, Dev/Test environments, Small to medium databases
      - gp3 (baseline 3000 IOPS and 125 MB/s throughput, scalable upto 16,000 IOPS and 1,000 MB/s throughput)
      - gp2 (baseline 3 IOPS/GB, burstable upto 3,000 IOPS, max 16,000 IOPS and 250 MB/s throughput)
    - IO Optimized (io1, io2) - Large databases, Mission-critical applications, High-performance computing
      - io2 Block Express (upto 256,000 IOPS and 4,000 MB/s throughput, provisioned and paid)
      - io1 (upto 64,000 IOPS and 1,000 MB/s throughput, provisioned and paid)
    - Throughput Optimized (st1) - Big data analytics, Data warehousing, Large sequential workloads
      - st1 (max burst throughput upto 500 MB/s)
    - Cold HDD (sc1) - Infrequently accessed data, Backup and restore, Disaster recovery
      - sc1 (max burst throughput upto 250 MB/s)
  
  - **EBS Multi Attach**
    - Attach a single EBS volume to multiple EC2 instances in the same AZ
    - Only supported for io1, io2, io2 Block Express volumes
    - Upto 16 EC2 instances can be attached to a single EBS volume
    - Gives high availability and fault tolerance
    - Applications must manage concurrent writes

2. **AMI (Amazon Machine Image)**
  - AMI is a template that contains the operating system, application server, and applications required to launch an instance.
  - **AMI Process**
    - Start the instance and customize it
    - Stop the instance (data integrity)
    - Create an AMI (also creates EBS snapshot)
    - Launch new instances from the AMI

3. **Instance Store**
  - Instance store is a temporary storage that is attached to an EC2 instance.
  - It is not persistent and is lost when the instance is stopped, terminated, or if the underlying hardware fails
  - It is bound to the specific physical host, not just an AZ
  - Analogy: Think of it like a physical USB stick
  - It is a physical drive not network drive. So latency will be low
  - Have a provisioned capacity (IOPS, GBs)

4. **EFS (Elastic File System)**
  - EFS is a managed file system that can be attached to multiple EC2 instances in the many AZs
  - It is a managed network file system
  - Highly available and scalable
  - Expensive and pay as you go
  - Use case: 
    - Content management systems
    - Web serving
    - Data sharing and wordpress
  - Uses NFSv4.1 protocol
  - Uses SG to control the access to EFS
  - File system scales automatically

  - **EFS Storage Tiers**
    - EFS Standard - For frequently accessed files, stored across multiple AZs
    - EFS One Zone - For frequently accessed files, stored in a single AZ (cheaper, but less resilient)
    - EFS Standard IA - Infrequently accessed, stored across multiple AZs, up to 92% cheaper than EFS Standard
    - EFS One Zone IA - Infrequently accessed, stored in a single AZ
    - EFS Archive - For rarely accessed data (few times a year), up to 50% cheaper than EFS IA

  - **EFS Lifecycle Management**
    - Lifecycle policies
      - Transition into IA - Files not accessed for 7, 14, 30, 60, or 90 days (default: 30 days)
      - Transition into Archive - Files not accessed for 90 days (default)
      - Transition into Standard - Files moved back to Standard on first access (EFS Intelligent-Tiering)

  - **EFS Access Points**
    - Application-specific entry points into an EFS file system
    - Enforce a POSIX user and group identity for all file system requests made through the access point
    - Restrict access to a specific root directory within the file system (clients can only see that directory and its subdirectories)
    - Automatically creates the root directory if it does not exist
    - Can be combined with IAM policies for fine-grained access control per application
    - Use cases:
      - Container-based environments (ECS, EKS) where each app needs isolated access
      - Sharing specific directories across AWS accounts
      - Multi-tenant applications where different users/apps need separate isolated paths
    - A file system can have upto 10,000 access points

5. **EBS vs EFS**

  | Feature | EBS | EFS |
  |---|---|---|
  | Storage Type | Block storage | Network file system (NFS) |
  | Attachment | Single EC2 instance (io1/io2 supports Multi-Attach upto 16 instances) | Multiple EC2 instances across multiple AZs |
  | Availability | Locked to a specific AZ | Multi-AZ by default (One Zone tier available) |
  | Scaling | Manually provisioned (size, IOPS) | Automatically scales up and down |
  | OS Support | Linux and Windows | Linux only |
  | Protocol | N/A (block level) | NFSv4.1 |
  | Persistence | Persists after instance stop | Persists independently of any instance |
  | Performance | Higher (lower latency, provisioned IOPS) | Slightly higher latency (network file system) |
  | Cost | Cheaper, pay for provisioned capacity | More expensive, pay per GB used |
  | Use Cases | Databases, boot volumes, single-instance workloads | Shared storage, CMS, web serving, containers |

6. **EC2 Instance Storage - Simple Analogy**

  - Think of it like storage options for a **developer's workstation setup**:

  - **EBS** - Your personal external SSD. It is attached to your machine (EC2 instance), stays in your building (AZ), and keeps your data even when you shut down for the day. Fast, reliable, but yours alone (mostly).

  - **AMI** - A disk image/snapshot of your entire workstation setup. You can clone it and spin up an identical machine anywhere in the office (region). The snapshot lives on a shared drive (S3), so it is not tied to any desk (AZ).

  - **Instance Store** - A RAM drive built into your physical machine. Blazing fast because it is local hardware, but the moment the machine powers off or dies, everything is gone. No backup, no recovery.

  - **EFS** - A shared NAS drive mounted on the office network. Every developer's machine (EC2 across AZs) can read and write to it at the same time. It grows automatically as the team adds more files. Slower than your personal SSD, but perfect for shared codebases, config files, or assets.

### Elastic Load Balancing

1. **What is Load Balancer?**
  - **Elastic Load Balancer (ELB)** - Automatically distributes incoming application traffic across multiple targets (like EC2 instances, containers, IPs) across one or more Availability Zones.
  - It is a fully managed service by AWS, so you don’t manage infrastructure
  - It is highly available and fault tolerant by default
  - It is a regional service and can span across multiple AZs
  - Performs health checks and routes traffic only to healthy targets
  - Can handle SSL/TLS termination (offloading encryption work from instances)
    
2. **Types of Load Balancers**
  - **Classic Load Balancer (CLB)** - Legacy load balancer, not recommended for new applications
    - Operates at both Layer 4 (TCP) and Layer 7 (HTTP/HTTPS) but in a limited way
    - Supports HTTP, HTTPS, TCP, SSL
    - Supports health checks and sticky sessions
    - No advanced routing features (no host/path-based routing)
    - Mostly replaced by ALB and NLB
  - **Application Load Balancer (ALB)** - Layer 7 load balancer, operates at the application layer
    - Operates at Layer 7 (HTTP/HTTPS)
    - Supports HTTP, HTTPS, WebSocket, HTTP/2
    - Advanced routing:
      - Path-based routing (/api, /admin)
      - Host-based routing (api.example.com)
      - Query string, headers, source IP
    - Supports target groups
    - Target groups:
      - EC2 instances
      - IP addresses (private IPs)
      - Lambda functions
    - Supports authentication (OIDC, Cognito)
    - Supports redirects and fixed responses
    - Ideal for microservices and web apps
  - **Network Load Balancer (NLB)** - Layer 4 load balancer, operates at the transport layer
    - Operates at Layer 4 (TCP/UDP/TLS)
    - Supports TCP, UDP, TLS
    - Ultra high performance, can handle millions of requests per second
    - Very low latency
    - Preserves source IP address (important difference from ALB)
    - Used for extreme performance / real-time systems
    - Target groups:
      - EC2 instances
      - IP addresses (private IPs)
      - ALB (used for chaining L4 -> L7)
    - Supports static IP (Elastic IP) unlike ALB
  - **Gateway Load Balancer (GLB)** - Layer 3 load balancer, operates at the network layer
    - Operates at Layer 3 (IP level)
    - Works with IP packets using GENEVE protocol (port 6081) → important exam point
    - Used to deploy and scale third-party virtual appliances
      - Firewalls
      - Intrusion Detection Systems (IDS)
      - Deep packet inspection systems
    - It achieves the following functions:
      - Acts as a single entry/exit point (gateway) for traffic
      - Distributes traffic across appliance fleet
      - Enables transparent network traffic inspection
    - Target groups:  
      - EC2 instances (virtual appliances)
      - IP addresses (private IPs)

3. **Sticky Sessions**
  - Sticky sessions (also called session affinity) ensure that all requests from a specific client are consistently routed to the same target instance.
  - This is useful for applications that maintain session state on the server side (e.g., shopping carts, user sessions).
  - **How it works:**
    - When a client makes a request, the load balancer sends it to a target based on its routing algorithm.
    - If sticky sessions are enabled, the load balancer sets a cookie in the client's browser.
    - On subsequent requests, the load balancer reads the cookie and routes the client to the same target that served the initial request.
  - **Types of sticky sessions:**
    - **Duration-based stickiness:** The load balancer maintains stickiness for a specified duration (e.g., 1 hour).
    - **Application-controlled stickiness:** The application sets a cookie to control stickiness.
  - **Use cases:**
    - Applications that maintain session state on the server side
    - Shopping carts
    - User sessions
    - Applications that require session affinity
  - **Important notes:**
    - Sticky sessions can reduce load balancing efficiency because they can lead to uneven distribution of traffic.
    - Sticky sessions should be used only when necessary and for limited durations.
    - Sticky sessions are not supported for Network Load Balancer.

--- 

## S3

---

## VPC

---


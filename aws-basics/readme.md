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

### Auto Scaling Groups

1. **What is an Auto Scaling Group?**
   - **Auto Scaling Group (ASG)** - Automatically adjusts the number of EC2
     instances based on demand, health checks, or a defined schedule.
   - It is a free, fully managed service by AWS - you only pay for the
     underlying EC2 instances and CloudWatch monitoring fees.
   - It is highly available and fault tolerant by design.
   - It is a **regional service** and can span multiple AZs within a region,
     but cannot span multiple regions.
   - ASG automatically balances instances across AZs when multiple AZs are
     configured.
   - When integrated with a Load Balancer, traffic is distributed across
     healthy instances automatically. Without a Load Balancer, ASG only
     manages instance count - it does not handle traffic distribution on
     its own.
   - Performs health checks and replaces unhealthy instances automatically.
   - **Three core parameters** that define an ASG's capacity:
     - **Minimum capacity** - Minimum number of instances always running
     - **Desired capacity** - Target number of instances ASG tries to maintain
     - **Maximum capacity** - Upper limit on how many instances can run

2. **ASG Launch Template**
   - **Launch Template** - A reusable configuration blueprint that ASG uses to
     launch new EC2 instances. It is preferred over the older Launch
     Configuration (which is now legacy and does not support all features).
   - A Launch Template specifies:
     - AMI + Instance Type
     - EC2 User Data (bootstrap script)
     - EBS Volumes
     - Security Groups
     - SSH Key Pair
     - IAM Roles
     - Network + Subnets
   - Note: The Load Balancer is configured at the **ASG level**, not inside
     the Launch Template.
   - Launch Templates support versioning, allowing you to update configs
     without replacing the template entirely.

3. **ASG Scaling Policies**
   - Scaling policies define **when and how** the ASG adjusts its capacity.
   - There are 5 types:

   - **Manual Scaling**
     - You manually set the desired capacity.
     - No automation - useful for one-time adjustments or testing.

   - **Scheduled Scaling**
     - Scale based on a **predictable, fixed schedule**.
     - Example: Increase min capacity to 10 every Monday at 8 AM, reduce
       back at 6 PM.
     - Use case: Known traffic patterns (business hours, weekly reports).

   - **Simple Scaling**
     - Responds to a **single CloudWatch alarm** by adding or removing a
       fixed number of instances.
     - After a scaling action, it must wait for the **cooldown period**
       (default: 300 seconds) to expire before responding to another alarm.
     - Least preferred today - Step Scaling is generally preferred over this.

   - **Step Scaling**
     - Like Simple Scaling, but with **multiple thresholds (steps)** that
       trigger different scaling amounts.
     - Example: CPU > 50% → add 1 instance, CPU > 80% → add 3 instances.
     - Does **not** wait for cooldown - continuously evaluates alarms even
       during an ongoing scaling activity.
     - More fine-grained control than Simple Scaling.

   - **Target Tracking Scaling** *(most recommended)*
     - You define a **target value for a CloudWatch metric** and ASG
       automatically scales to maintain it.
     - Example: Keep average CPU utilization at 50%.
     - AWS manages the scale-out and scale-in logic for you.
     - Predefined metrics available:
       - `ASGAverageCPUUtilization`
       - `ASGAverageNetworkIn` / `ASGAverageNetworkOut`
       - `ALBRequestCountPerTarget` (requires ALB integration)
     - Custom CloudWatch metrics are also supported.
     - This is the **default and most intelligent** policy type.

   - **Predictive Scaling**
     - Uses **machine learning** to analyze historical traffic patterns and
       proactively schedule scaling in advance.
     - Detects daily and weekly patterns automatically.
     - Capacity is ready **before** the traffic hits, unlike reactive policies.
     - Best combined with Target Tracking for both proactive and reactive
       coverage.

4. **ASG Cooldown Period**
   - After a scaling activity completes, the ASG waits for the cooldown
     period before initiating another scaling action.
   - Default cooldown: **300 seconds**.
   - Purpose: Allows newly launched instances time to boot and start handling
     traffic before ASG decides if more scaling is needed.
   - Applies to **Simple Scaling** policies. Step and Target Tracking policies
     use a separate **instance warmup** setting instead.
   - Reducing the cooldown period speeds up scale-in (faster cost savings
     when demand drops).

5. **ASG Health Checks**
   - **EC2 Health Check (default)** - Checks if the instance is in a running
     state. Replaces instances if the underlying hardware fails. Does NOT
     detect application-level failures.
   - **ELB Health Check** - If enabled, the ASG uses the Load Balancer's
     health check results. If the ELB marks an instance as `OutOfService`
     (e.g., returning HTTP 500 errors), ASG terminates and replaces it.
     Strongly recommended for web applications.
   - **Custom Health Check** - You can send a custom health signal to the ASG
     using the AWS CLI or SDK.
   - Health check grace period: A configurable delay (default 300s) before
     ASG starts performing health checks on a newly launched instance,
     giving it time to initialize.

6. **ASG Lifecycle Hooks**
   - Allow you to **pause an instance** at a transition point to perform
     custom actions before it enters service or before it is terminated.
   - **Launch hook** - Pause an instance before it goes InService. Use this
     to install software, run configuration scripts, or warm up caches.
   - **Termination hook** - Pause an instance before it is terminated. Use
     this to drain connections, copy logs to S3, or deregister from services.
   - After the custom action completes, you signal the ASG with
     `CONTINUE` (proceed) or `ABANDON` (terminate the instance).

7. **ASG Integration with Load Balancer**
   - ASG integrates with **ALB, NLB, or Classic ELB**.
   - When integrated:
     - New instances launched by ASG are automatically registered with the
       Load Balancer's Target Group.
     - Terminated instances are automatically deregistered.
   - The Load Balancer and ASG must be in the **same region**.
   - ELB Health Checks should be enabled on the ASG when using a Load
     Balancer, to ensure unhealthy instances are replaced properly.

8. **ASG Instance Mix (Spot + On-Demand)**
   - ASG supports running a **mix of On-Demand and Spot Instances** to
     balance cost and availability.
   - Common pattern: 20% On-Demand (stable baseline) + 80% Spot (cost
     savings of up to 90%).
   - AWS recommends diversifying across multiple instance types and AZs when
     using Spot to reduce interruption risk. 

--- 

## RDS (Relational Database Service)

### RDS Basics
- RDS is a managed database service that makes it easier to set up, operate, and scale a relational database in the cloud.
- RDS supports the following database engines:
    - PostgreSQL
    - MySQL
    - MariaDB
    - Oracle
    - Microsoft SQL Server
    - Amazon Aurora
- RDS is a managed service, which means that AWS takes care of the underlying infrastructure, including:
    - Patching
    - Backups
    - Monitoring
    - Scaling
    - Security
    - High Availability
    - Disaster Recovery
- You can focus on using your database instead of managing it.
- Even though RDS uses EC2 instances in the backend, you cannot SSH into or directly access those underlying EC2 instances.

### RDS Scaling
- RDS supports the following scaling options:
    - Vertical Scaling (scaling up/down the instance class)
    - Horizontal Scaling (Read Replicas for read-heavy workloads)


### RDS Read Replicas vs Multi AZ

#### RDS Read Replicas
- When there is an increase in read traffic on a specific DB instance, Read Replicas can be used to scale out read operations.
- Read Replicas are read-only copies of the primary database - they serve only read operations, not write operations.
- Replication is **asynchronous**, meaning there can be a small lag between the primary database and the read replicas (eventual consistency).
- The application must manage which connection string points to the primary (for writes) and which points to a replica (for reads) - AWS does not abstract this automatically.
- You can have up to **15 read replicas** per DB instance (for MySQL, MariaDB, PostgreSQL, SQL Server). Oracle supports up to 5.
- There is **no data transfer cost** for replication within the same AWS Region. Cross-region replication incurs network charges.
- Read Replicas can be **promoted to standalone DB instances** - useful as a manual disaster recovery option if the primary fails.

**Eg:** An e-commerce platform experiences a heavy spike in product browsing and search queries during a sale event, but the number of actual purchases (writes) remains relatively low. Instead of over-provisioning the primary DB instance, the team creates 2-3 Read Replicas and routes all `SELECT` queries (product listings, search, order history) to the replicas. The primary instance handles only `INSERT`/`UPDATE`/`DELETE` operations (checkouts, inventory updates). This keeps the primary instance healthy and reduces latency for both readers and writers.

#### RDS Multi-AZ
- Multi-AZ is designed for **high availability and automatic failover** - not for read scaling.
- Replication to the standby is **synchronous**, meaning data is written to both the primary and standby simultaneously - zero data loss on failover.
- The **standby instance is not accessible** for reads or writes during normal operation. It exists solely for failover. (Multi-AZ is NOT a read-scaling solution.)
- In case of a primary failure (hardware issue, AZ outage, etc.), RDS **automatically fails over** to the standby - typically under 35 seconds - with no manual intervention needed.
- The **DNS endpoint remains the same** after failover, so the application reconnects automatically without any connection string changes.
- There is **no network cost** for replication to the standby when both are in the same region.
- Multi-AZ is available within a **single AWS Region** only - cross-region Multi-AZ is not supported (use cross-region Read Replicas for that).

**Eg:** A fintech company runs a payment processing service where even a few minutes of downtime causes revenue loss and SLA breaches. They deploy their RDS MySQL instance with Multi-AZ enabled. During a routine maintenance window, AWS fails over to the standby seamlessly - the application experiences only a brief blip (under 35 seconds) and reconnects automatically via the same DNS endpoint, with no data loss. No engineer needs to be paged.

#### Combining Both
- Read Replicas and Multi-AZ can be used together. You can configure the primary DB as Multi-AZ (for high availability) and also attach Read Replicas (for read scalability).
- You can even configure a Read Replica itself to be Multi-AZ, making it a robust DR target in another region.

### Amazon Aurora
- Aurora is AWS's own cloud-native relational database engine, compatible with MySQL and PostgreSQL, but re-architected from the ground up for the cloud.
- Shared distributed storage that auto-grows up to **128 TiB** (in 10 GiB increments) - no need to pre-provision storage.
- Aurora automatically maintains **6 copies** of your data across **3 Availability Zones** for high durability - storage is self-healing.
- Supports up to **15 Read Replicas** with minimal replica lag (usually under 100ms).
- Aurora is typically **5x faster than RDS MySQL** and **3x faster than RDS PostgreSQL**.
- Aurora exposes two key endpoints to abstract the cluster from the application:
  - **Writer Endpoint** - Always points to the current primary instance. On failover, it automatically redirects to the newly promoted primary - no connection string change needed in the app.
  - **Reader Endpoint** - Automatically load-balances read traffic across all available Read Replicas.

#### Features of Aurora

##### 1. Aurora High Availability
- Aurora automatically replicates data 6 ways across 3 AZs. If a primary instance fails, Aurora promotes one of the Read Replicas to become the new primary automatically - typically within 30 seconds.
- The Writer Endpoint DNS is updated automatically so the application reconnects to the new primary seamlessly.

##### 2. Aurora Serverless (v2)
- An on-demand, auto-scaling configuration for Aurora where AWS automatically adjusts compute (CPU + memory) based on actual application load - you don't manage instance sizes.
- Scales instantly and in fine-grained increments (as small as 0.5 ACUs) with no downtime or connection drops.
- You pay per second only for the capacity consumed.
- Supports the full Aurora feature set including Multi-AZ, Global Database, and Read Replicas (unlike the older v1).
- **Use case:** Unpredictable or spiky workloads - e.g. a SaaS app that is idle most of the day but gets heavy bursts during business hours. With Serverless v2, the cluster scales up during the burst and scales down automatically when traffic drops, avoiding the cost of a permanently over-provisioned instance.

##### 3. Aurora Auto Scaling
- Automatically adds or removes Read Replicas based on CloudWatch metrics like average CPU utilization or average DB connections across the reader fleet.
- You define a min and max replica count; Aurora scales within that range in response to actual workload.
- Newly auto-scaled replicas are assigned the lowest failover priority (tier-15) so manually created replicas are always promoted first during a failure.
- **Use case:** An e-commerce platform that has steady traffic during weekdays but massive read spikes on weekends. Auto Scaling adds replicas when CPU crosses a threshold (e.g. 60%) and removes them when traffic subsides - no manual intervention needed.

##### 4. Aurora Backtrack
- Allows you to **rewind** an Aurora DB cluster to a specific point in time **without restoring from a backup and without creating a new DB cluster**.
- Works by maintaining a FIFO buffer of change records (Log Sequence Numbers). Rewinding typically completes in minutes, compared to hours for a snapshot restore.
- You configure a **target backtrack window** (e.g. 24 hours) when creating the cluster. The actual window may be shorter depending on workload volume.
- **Important limitation: Backtrack is only available for Aurora MySQL-Compatible Edition. It is NOT supported for Aurora PostgreSQL.**
- Must be enabled at cluster creation time - it cannot be enabled after the fact.
- **Use case:** A developer accidentally runs `DELETE FROM orders` without a `WHERE` clause on a production Aurora MySQL database. Instead of restoring a snapshot (which could take hours and require a new cluster), they use Backtrack to rewind the cluster to 5 minutes before the mistake - with minimal downtime and zero data loss beyond that window.

##### 5. Aurora Global Database
- Spans **multiple AWS Regions** - one primary region for reads and writes, and up to 5 read-only secondary regions.
- Replication from primary to secondary regions happens with typical latency of **under 1 second**.
- If the primary region goes down, a secondary region can be promoted to primary in under 1 minute (RPO ~1s, RTO ~1min).
- **Use case:** A globally distributed SaaS application with users in the US, Europe, and Asia. Writes happen in `us-east-1` (primary), but users in `eu-west-1` and `ap-southeast-1` read from their local Aurora secondary clusters with low latency. If `us-east-1` has an outage, `eu-west-1` is promoted as the new primary.

##### 6. Aurora Security
- Encryption at rest using AWS KMS (must be enabled at cluster creation).
- Encryption in transit using SSL/TLS.
- Network isolation via Amazon VPC.
- IAM Database Authentication - allows connecting to Aurora using IAM roles/users instead of a static DB password (supported for MySQL and PostgreSQL compatible editions).
- Integration with AWS Secrets Manager for automatic credential rotation.

##### 7. Aurora Monitoring
- Native integration with **Amazon CloudWatch** for metrics like CPU, connections, replica lag, and read/write IOPS.
- **RDS Performance Insights** - identifies the top SQL queries causing load, helping pinpoint slow queries and bottlenecks.
- **Enhanced Monitoring** - provides OS-level metrics (memory, disk I/O, processes) at up to 1-second granularity.
- **Aurora Events and Notifications** - sends SNS notifications for cluster events like failover, backup completion, etc.

##### 8. Aurora Machine Learning
- Allows you to add ML-based predictions, recommendations, and anomaly detection to your applications using familiar SQL commands, without requiring you to build, train, or deploy separate ML models.
- Integrates with Amazon SageMaker and Amazon Comprehend to provide ML capabilities directly within your Aurora database.
- **Use case:** An e-commerce platform wants to add product recommendations to its application. Instead of building a separate recommendation engine, they can use Aurora Machine Learning to train a recommendation model using their existing product and customer data, and then query the model directly from their application using SQL.

---
 
## S3

---

## VPC

---


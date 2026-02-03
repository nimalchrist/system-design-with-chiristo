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

--- 

## S3

---

## VPC

---


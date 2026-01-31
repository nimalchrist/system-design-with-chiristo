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

## EC2

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

---

## S3

---

## VPC

---


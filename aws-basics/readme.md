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

---

## EC2

---

## S3

---

## VPC

---


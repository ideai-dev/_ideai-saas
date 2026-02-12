# Deployment Guide

This guide covers deploying your 2027 Full-Stack Monorepo to production.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                  Next.js 16 on Vercel                        │
│                  (apps/web)                                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS/REST API
                 │
       ┌─────────┴─────────┐
       │                   │
┌──────▼───────┐    ┌──────▼───────┐
│   FastAPI    │    │   Node.js    │
│   Service    │    │   Service    │
│   AWS Lambda │    │   AWS Lambda │
│   /ECS       │    │   /ECS       │
└──────┬───────┘    └──────┬───────┘
       │                   │
       └─────────┬─────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────┐              ┌────▼────┐
│   RDS  │              │  Redis  │
│Postgres│              │ElastiCache│
└────────┘              └─────────┘
```

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI
   pnpm add -g vercel
   
   # Login
   vercel login
   
   # Link project
   vercel link
   ```

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm turbo run build --filter=web`
   - Output Directory: `apps/web/.next`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_PYTHON_URL=https://api.yourdomain.com
   NEXT_PUBLIC_API_NODE_URL=https://api-node.yourdomain.com
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Backend Deployment (AWS)

### Option 1: AWS Lambda (Serverless)

#### FastAPI on Lambda

1. **Install Mangum**
   ```bash
   cd services/api-python
   pip install mangum
   ```

2. **Update main.py**
   ```python
   from mangum import Mangum
   
   # ... existing FastAPI code ...
   
   handler = Mangum(app)
   ```

3. **Deploy with AWS SAM or Serverless Framework**
   ```yaml
   # serverless.yml
   service: api-python
   
   provider:
     name: aws
     runtime: python3.12
     region: us-east-1
   
   functions:
     api:
       handler: main.handler
       events:
         - httpApi: '*'
   ```

4. **Deploy**
   ```bash
   serverless deploy
   ```

#### Node.js on Lambda

1. **Create Lambda handler**
   ```typescript
   // services/api-node/src/lambda.ts
   import serverless from 'serverless-http';
   import app from './index';
   
   export const handler = serverless(app);
   ```

2. **Deploy**
   ```bash
   serverless deploy
   ```

### Option 2: AWS ECS (Container-based)

1. **Build Docker images**
   ```bash
   # Python API
   docker build -f docker/Dockerfile.python -t api-python .
   
   # Node.js API
   docker build -f docker/Dockerfile.node -t api-node .
   ```

2. **Push to ECR**
   ```bash
   # Authenticate
   aws ecr get-login-password --region us-east-1 | \
     docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
   
   # Tag and push
   docker tag api-python:latest <account>.dkr.ecr.us-east-1.amazonaws.com/api-python:latest
   docker push <account>.dkr.ecr.us-east-1.amazonaws.com/api-python:latest
   ```

3. **Create ECS Task Definitions**
   - Define tasks in AWS ECS console
   - Configure CPU/Memory
   - Set environment variables
   - Configure load balancer

4. **Deploy to ECS**
   ```bash
   # Update service
   aws ecs update-service \
     --cluster your-cluster \
     --service api-python \
     --force-new-deployment
   ```

### Option 3: AWS App Runner (Easiest)

1. **Connect to GitHub**
   - Go to AWS App Runner console
   - Create new service
   - Connect to your GitHub repository

2. **Configure**
   - Source: Python 3.12 / Node.js 20
   - Build command: Auto-detected
   - Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`

3. **Deploy**
   - App Runner automatically builds and deploys
   - Provides HTTPS endpoint

## Database Setup (AWS RDS)

1. **Create RDS Instance**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier mydb \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --engine-version 16.1 \
     --master-username admin \
     --master-user-password <password> \
     --allocated-storage 20
   ```

2. **Configure Security Groups**
   - Allow inbound traffic from Lambda/ECS security groups
   - Port 5432 for PostgreSQL

3. **Run Migrations**
   ```bash
   # From local machine with connection to RDS
   DATABASE_URL=postgresql://admin:pass@rds-endpoint:5432/db alembic upgrade head
   ```

## Cache Setup (AWS ElastiCache)

1. **Create Redis Cluster**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id my-redis \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --num-cache-nodes 1
   ```

2. **Configure Security Groups**
   - Allow inbound traffic on port 6379

## Environment Variables

### Production Environment Variables

Create these in your deployment platform:

**Vercel (Frontend)**
- `NEXT_PUBLIC_API_PYTHON_URL`
- `NEXT_PUBLIC_API_NODE_URL`

**AWS Lambda/ECS (Backend)**
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `AWS_REGION`
- `CORS_ORIGINS`

## Monitoring

### CloudWatch

1. **Enable Logging**
   - Lambda: Automatic CloudWatch Logs
   - ECS: Configure log driver in task definition

2. **Set Up Alarms**
   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name high-error-rate \
     --alarm-description "Alert on high error rate" \
     --metric-name Errors \
     --namespace AWS/Lambda \
     --statistic Sum \
     --period 300 \
     --threshold 10 \
     --comparison-operator GreaterThanThreshold
   ```

### Sentry (Optional)

1. **Install SDK**
   ```bash
   # Python
   pip install sentry-sdk
   
   # Node.js
   pnpm add @sentry/node
   ```

2. **Configure**
   ```python
   # Python
   import sentry_sdk
   sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"))
   ```

## CI/CD Pipeline

The included GitHub Actions workflow automatically:
1. Runs tests on every PR
2. Builds and type-checks code
3. Deploys to Vercel on merge to main

For backend deployment, add:
- AWS credentials to GitHub Secrets
- Deploy steps to `.github/workflows/deploy.yml`

## Cost Optimization

### Serverless (Lambda + RDS Proxy)
- **Best for**: Variable traffic
- **Cost**: Pay per request
- **Scaling**: Automatic

### Containers (ECS Fargate)
- **Best for**: Consistent traffic
- **Cost**: Pay for CPU/memory hours
- **Scaling**: Configure auto-scaling

### Database
- Use RDS Proxy for connection pooling with Lambda
- Consider Aurora Serverless v2 for variable traffic
- Use read replicas for high read traffic

## Rollback Strategy

### Vercel
- Use Vercel dashboard to rollback to previous deployment
- Or: `vercel rollback <deployment-url>`

### AWS Lambda
- Use Lambda versions and aliases
- Rollback by updating alias to previous version

### AWS ECS
- Keep previous task definition versions
- Update service to use previous task definition

## Security Checklist

- [ ] All secrets in environment variables
- [ ] Database not publicly accessible
- [ ] Security groups properly configured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (use ORMs)
- [ ] Regular security updates

## Support

For deployment issues:
- Check CloudWatch Logs
- Review Vercel deployment logs
- Verify environment variables
- Check security group rules
- Review IAM permissions

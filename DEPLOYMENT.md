# Deployment Guide

This guide covers deploying the distributed microservices architecture to various platforms.

## Local Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Setup
1. Clone all repositories:
   ```bash
   git clone <api-gateway-repo> api-gateway
   git clone <user-service-repo> user-service
   git clone <product-service-repo> product-service
   ```

2. Start with Docker Compose:
   ```bash
   cd api-gateway
   docker-compose up --build
   ```

## Docker Deployment

### Building Images
```bash
# Build all services
docker-compose build

# Build individual services
docker build -t api-gateway ./gateway
docker build -t user-service ./user-service
docker build -t product-service ./product-service
```

### Running Containers
```bash
# Production mode
docker-compose up -d

# Development mode with hot reload
docker-compose -f docker-compose.dev.yml up
```

## Cloud Deployment

### AWS ECS

1. **Create ECR repositories:**
   ```bash
   aws ecr create-repository --repository-name api-gateway
   aws ecr create-repository --repository-name user-service
   aws ecr create-repository --repository-name product-service
   ```

2. **Build and push images:**
   ```bash
   # Tag and push API Gateway
   docker tag api-gateway:latest <account>.dkr.ecr.<region>.amazonaws.com/api-gateway:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/api-gateway:latest
   
   # Repeat for other services
   ```

3. **Create ECS task definitions and services**

### Google Cloud Run

1. **Build and deploy:**
   ```bash
   # API Gateway
   gcloud builds submit --tag gcr.io/<project>/api-gateway ./gateway
   gcloud run deploy api-gateway --image gcr.io/<project>/api-gateway --platform managed
   
   # User Service
   gcloud builds submit --tag gcr.io/<project>/user-service ./user-service
   gcloud run deploy user-service --image gcr.io/<project>/user-service --platform managed
   
   # Product Service
   gcloud builds submit --tag gcr.io/<project>/product-service ./product-service
   gcloud run deploy product-service --image gcr.io/<project>/product-service --platform managed
   ```

2. **Update environment variables:**
   ```bash
   gcloud run services update api-gateway --set-env-vars="USER_SERVICE_URL=https://user-service-<hash>-uc.a.run.app,PRODUCT_SERVICE_URL=https://product-service-<hash>-uc.a.run.app"
   ```

### Azure Container Instances

1. **Create resource group:**
   ```bash
   az group create --name microservices-rg --location eastus
   ```

2. **Deploy services:**
   ```bash
   # API Gateway
   az container create --resource-group microservices-rg --name api-gateway --image <registry>/api-gateway:latest --ports 3000
   
   # User Service
   az container create --resource-group microservices-rg --name user-service --image <registry>/user-service:latest --ports 3001
   
   # Product Service
   az container create --resource-group microservices-rg --name product-service --image <registry>/product-service:latest --ports 3002
   ```

## Kubernetes Deployment

### Create Namespace
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: microservices
```

### API Gateway Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: microservices
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: api-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: USER_SERVICE_URL
          value: "http://user-service:3001"
        - name: PRODUCT_SERVICE_URL
          value: "http://product-service:3002"
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  namespace: microservices
spec:
  selector:
    app: api-gateway
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### User Service Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  namespace: microservices
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3001
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: microservices
spec:
  selector:
    app: user-service
  ports:
  - port: 3001
    targetPort: 3001
```

### Product Service Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-service
  namespace: microservices
spec:
  replicas: 2
  selector:
    matchLabels:
      app: product-service
  template:
    metadata:
      labels:
        app: product-service
    spec:
      containers:
      - name: product-service
        image: product-service:latest
        ports:
        - containerPort: 3002
---
apiVersion: v1
kind: Service
metadata:
  name: product-service
  namespace: microservices
spec:
  selector:
    app: product-service
  ports:
  - port: 3002
    targetPort: 3002
```

## Environment Variables

### Development
```bash
USER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
USER_SERVICE_TIMEOUT=5000
PRODUCT_SERVICE_TIMEOUT=5000
```

### Production
```bash
USER_SERVICE_URL=https://user-service.yourdomain.com
PRODUCT_SERVICE_URL=https://product-service.yourdomain.com
USER_SERVICE_TIMEOUT=10000
PRODUCT_SERVICE_TIMEOUT=10000
USER_SERVICE_RETRIES=3
PRODUCT_SERVICE_RETRIES=3
```

## Monitoring and Health Checks

### Health Check Endpoints
- API Gateway: `GET /health`
- User Service: `GET /health`
- Product Service: `GET /health`

### Monitoring Setup
1. **Prometheus metrics** (add to each service)
2. **Grafana dashboards**
3. **Alerting rules**
4. **Log aggregation** (ELK stack or similar)

## Security Considerations

1. **Network policies** (Kubernetes)
2. **TLS/SSL certificates**
3. **API authentication**
4. **Rate limiting**
5. **Input validation**
6. **Security headers** (Helmet.js)

## Scaling

### Horizontal Scaling
- Increase replica count in Kubernetes
- Use load balancers
- Implement service mesh (Istio)

### Vertical Scaling
- Increase CPU/memory limits
- Optimize application code
- Use connection pooling

## Backup and Recovery

1. **Database backups** (when using persistent storage)
2. **Configuration backups**
3. **Disaster recovery procedures**
4. **Rollback strategies**

## Troubleshooting

### Common Issues
1. **Service discovery problems**
2. **Network connectivity issues**
3. **Resource constraints**
4. **Configuration errors**

### Debug Commands
```bash
# Check service health
curl http://localhost:3000/health

# View logs
docker-compose logs -f api-gateway

# Check service connectivity
docker exec -it <container> ping <service-name>
```

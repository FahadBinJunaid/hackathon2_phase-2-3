---
name: docker-kubernetes-skill
description: Containerize applications and deploy to Kubernetes. Use for Phase 4 and 5 deployments with Helm charts.
---

# Docker & Kubernetes Deployment

## Instructions

1. **Dockerfile Creation**
   - Use multi-stage builds for optimization
   - Separate images for frontend and backend
   - Minimize final image size
   - Don't include unnecessary files

2. **Kubernetes Manifests**
   - Create Deployments for each service
   - Define Services for networking
   - Use ConfigMaps for configuration
   - Store secrets in Kubernetes Secrets

3. **Helm Charts**
   - Template all manifests
   - Use values.yaml for environment-specific config
   - Support multiple environments (dev, staging, prod)

4. **Best Practices**
   - Add health checks (liveness/readiness probes)
   - Set resource limits and requests
   - Use Horizontal Pod Autoscaling
   - Implement rolling updates

## Example Dockerfile (FastAPI Backend)

```dockerfile
# Multi-stage build for optimization
FROM python:3.13-slim as base

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Example Dockerfile (Next.js Frontend)

```dockerfile
FROM node:20-alpine as base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build application
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine as production

WORKDIR /app

COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

CMD ["npm", "start"]
```

## Example Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: todo-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secret
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

## Example Kubernetes Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
```

## Example Helm Chart Structure

```
todo-app/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
```
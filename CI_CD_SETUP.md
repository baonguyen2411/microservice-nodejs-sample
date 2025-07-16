# CI/CD Setup Documentation

This document describes the GitHub Actions CI/CD pipeline setup for your microservices project.

## 🏗️ Project Structure

Your project contains 4 Node.js/TypeScript microservices:
- `api-gateway` - Main entry point (port 4000)
- `auth-service` - Authentication service (port 4001)
- `user-service` - User management service (port 4002)
- `tour-service` - Tour management service (port 4003)

## 📋 CI/CD Workflows

### 1. Main CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Features:**
- **Smart Change Detection**: Only runs jobs for services that have changed
- **Parallel Execution**: Runs jobs for all services simultaneously for speed
- **Comprehensive Testing**:
  - ESLint code linting
  - Prettier formatting checks
  - TypeScript compilation
  - Docker image building
  - Integration testing with docker-compose
  - Security scanning with npm audit and Trivy

**Jobs:**
1. **Changes Detection**: Identifies which services have been modified
2. **Lint and Build**: Runs linting, formatting checks, and TypeScript compilation for each service
3. **Docker Build**: Builds Docker images for each service with caching
4. **Integration Test**: Starts all services with docker-compose and runs health checks
5. **Security Scan**: Runs vulnerability scans on dependencies and code
6. **Notify**: Provides a summary of all job results

### 2. Deployment Pipeline (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch
- Git tags starting with `v*` (e.g., v1.0.0)

**Features:**
- **Container Registry**: Pushes Docker images to GitHub Container Registry (ghcr.io)
- **Multi-platform Builds**: Builds for both AMD64 and ARM64 architectures
- **Smart Tagging**: Creates multiple tags (latest, branch name, semver, SHA)
- **Production Manifests**: Generates production-ready docker-compose files
- **Deployment Artifacts**: Uploads deployment files as GitHub artifacts

**Outputs:**
- Docker images published to `ghcr.io/[your-username]/[service-name]:latest`
- Production docker-compose file for deployment

### 3. Code Quality Checks (`.github/workflows/code-quality.yml`)

**Triggers:**
- Every push and pull request

**Features:**
- **Fast Feedback**: Lightweight checks that run quickly
- **TypeScript Validation**: Ensures code compiles without errors
- **Code Standards**: Checks formatting and linting
- **Security Checks**: Scans for hardcoded credentials and common issues
- **Project Health**: Analyzes Docker files and package.json scripts
- **Metrics**: Provides code statistics and repository health summary

### 4. Dependency Management (`.github/dependabot.yml`)

**Features:**
- **Automated Updates**: Weekly dependency updates for all services
- **Multiple Ecosystems**: Handles npm, Docker, and GitHub Actions updates
- **Organized PRs**: Limited number of PRs with proper commit messages
- **Scheduled**: Runs on Mondays to avoid disrupting workflow

## 🚀 Getting Started

### Prerequisites

1. **GitHub Repository**: Ensure your code is in a GitHub repository
2. **Container Registry Access**: GitHub Container Registry is enabled by default
3. **Environment Variables**: Set up required environment variables for deployment

### Setting Up Environment Variables

For production deployment, you'll need to set these environment variables:

```bash
SECRET_KEY_ACCESS_TOKEN=your-secret-key
AUTH_SERVICE_URI=http://auth-service:4001
USER_SERVICE_URI=http://user-service:4002
TOUR_SERVICE_URI=http://tour-service:4003
MONGO_URI=mongodb://your-mongo-host:27017/your-database
```

### Required Health Check Endpoints

The CI pipeline expects each service to have a health check endpoint at `/health`. Add these to your services:

```typescript
// Example health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'service-name',
    timestamp: new Date().toISOString()
  });
});
```

## 📊 Monitoring and Maintenance

### Viewing CI/CD Results

1. **Actions Tab**: Go to your repository's Actions tab to see workflow runs
2. **Pull Request Checks**: CI status appears automatically on pull requests
3. **Deployment Summary**: Check the job summary for deployment information
4. **Artifacts**: Download production manifests from successful deployment runs

### Troubleshooting Common Issues

#### 1. Build Failures
```bash
# Check if dependencies are properly installed
npm ci

# Verify TypeScript compilation
npm run build

# Run linting
npm run lint
```

#### 2. Docker Build Issues
```bash
# Test Docker build locally
docker build -t service-name ./service-directory

# Check Dockerfile syntax
docker build --dry-run ./service-directory
```

#### 3. Integration Test Failures
```bash
# Test docker-compose locally
docker-compose up -d
docker-compose ps
docker-compose logs service-name
```

### Performance Optimization

The CI pipeline includes several optimizations:
- **Caching**: npm packages and Docker layers are cached
- **Parallel Execution**: Jobs run simultaneously when possible
- **Change Detection**: Only builds services that have changed
- **Build Caching**: Docker build cache is shared between runs

## 🔧 Customization

### Adding Tests

When you add test scripts to your services, update the CI pipeline:

```yaml
# Add this step to the lint-and-build job
- name: Run tests
  working-directory: ${{ matrix.service }}
  run: npm test
```

### Adding New Services

1. Add the service directory to your repository
2. Update the matrix in `.github/workflows/ci.yml`:
   ```yaml
   strategy:
     matrix:
       service: [api-gateway, auth-service, user-service, tour-service, new-service]
   ```
3. Add change detection for the new service:
   ```yaml
   new-service:
     - 'new-service/**'
   ```

### Custom Deployment

To deploy to a different container registry:

1. Update the `REGISTRY` environment variable in `deploy.yml`
2. Add registry credentials to GitHub Secrets
3. Update the login action with your registry details

## 🔒 Security

### Secrets Management

- **No Hardcoded Secrets**: The pipeline scans for hardcoded credentials
- **GitHub Secrets**: Use GitHub repository secrets for sensitive data
- **Environment Variables**: All secrets are passed as environment variables

### Vulnerability Scanning

- **npm audit**: Checks for known vulnerabilities in dependencies
- **Trivy**: Scans for security issues in code and dependencies
- **Dependabot**: Automatically updates vulnerable dependencies

## 📝 Best Practices

1. **Commit Message Format**: Use conventional commits for better tracking
2. **Branch Protection**: Require CI checks to pass before merging
3. **Code Reviews**: Always review code before merging to main
4. **Semantic Versioning**: Use tags like v1.0.0 for releases
5. **Regular Updates**: Keep dependencies updated via Dependabot

## 🆘 Support

If you encounter issues:

1. Check the Actions tab for detailed error logs
2. Review this documentation for common solutions
3. Ensure all required files and endpoints are in place
4. Test locally before pushing to GitHub

## 📅 Maintenance Schedule

- **Weekly**: Dependabot runs dependency updates
- **On Push**: Code quality checks run automatically
- **On PR**: Full CI pipeline runs for validation
- **On Release**: Deployment pipeline builds and publishes containers

---

This CI/CD setup provides a robust, secure, and efficient pipeline for your microservices project. It follows industry best practices and can be easily extended as your project grows.
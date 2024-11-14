# Contribution Guidelines

We are always open to accepting any potential contributions. Here is how you can contribute:

1. Fork the repository
2. Clone your forked repository

```bash
git clone https://github.com/your-username/repository-name.git
```

3. Install dependencies for both mlflow and mlflow-site directories

```bash
cd mlflow && npm install
cd ../mlflow-site && npm install
```

3a. Optional: MLflow Tracking Server container using Docker

```bash
cd mlflow
npm run docker
```

4. Run the mlflow-site

```bash
npm run dev
```

5. Create your feature branch

```bash
git checkout -b feature/AmazingFeature
```

6. Make your changes

7. Run ESLint to check code style

```bash
npm run lint
```

8. Run tests to ensure your changes don't break existing functionality

   (Make sure you have mlflow UI server running on port 5002. We set 5002 as our default port for testing.)

```bash
mlflow ui --port 5002 # Run this in a separate terminal
npm run test
```

9. Commit your changes

```bash
git commit -m 'Add AmazingFeature'
```

10. Push to the branch

```bash
git push origin feature/AmazingFeature
```

11. Open a Pull Request

**Note:** Please ensure your code adheres to our style guidelines and includes appropriate documentation for any new features.

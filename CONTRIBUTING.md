# Contribution Guidelines

We are always open to accepting any potential contributions. Here is how you can contribute:

1. Fork the repository
2. Clone your forked repository

```bash
git clone https://github.com/your-username/repository-name.git
```

3. Create your feature branch

```bash
git checkout -b feature/AmazingFeature
```

4. Install dependencies for both mlflow and mlflow-site directories

```bash
cd /mlflow && npm install
cd ../mlflow-site && npm install
```

5. Start the MLflow Tracking Server

```bash
cd ../mlflow && npm run docker
```

This will launch the MLflow UI on your local machine at `http://localhost:5001`.

6. Make your changes

7. Run ESLint to check code style

```bash
npm run lint
```

8. Run tests to ensure your changes don't break existing functionality

   (Make sure you have mlflow UI server running on port 5002. We set 5002 as our default port for testing.)

```bash
cd /mlflow && npm run dockerTest # Run this in a separate terminal
npm run test
```

This will launch the MLflow UI on your local machine at `http://localhost:5002`, and run the Jest tests.

9. Add and commit your changes

If the tests all pass:

```bash
git add .
git commit -m 'Add AmazingFeature'
```

10. Push to the branch

```bash
git push origin feature/AmazingFeature
```

11. Open a Pull Request

**Note:** Please ensure your code adheres to our style guidelines and includes appropriate documentation for any new features.

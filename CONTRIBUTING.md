## Contributing

We are always open to accepting any potential contributions. Here is how you can contribute:

1. Fork the repository
2. Clone your forked repository

```bash
git clone https://github.com/your-username/respository-name.git
```

3. Install dependencies for both mlflow and mlfow-site directories

```bash
cd mlflow && npm install
cd ../mlflow-site && npm install
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

7. Run tests to ensure your changes don't break existing functionality

   (Make sure you have mlflow UI server running on port 5002: `mlflow ui --port 5002`)

```bash
npm run test
```

8. Commit your changes

```bash
git commit -m 'Add AmazingFeature'
```

9. Push to the branch

```bash
git push origin feature/AmazingFeature
```

10. Open a Pull Request

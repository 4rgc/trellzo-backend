
# Trellzo

The backend for **your new project planning app** ~~ripoff~~.

---

## Run Locally (dev environment)

> *Note: can only run the MongoDB container at the moment*

1. Install Docker:
   - [on macOS](https://docs.docker.com/docker-for-mac/install/)
   - [on Windows](https://docs.docker.com/docker-for-windows/install/)
2. Clone the repository

```bash
  git clone https://github.com/4rgc/trellzo-backend.git
```

3. Go to the project directory

```bash
  cd trellzo-backend
```

4. Install dependencies

```bash
  npm install
```

5. Start the conatiner

```bash
  npm run mongo-up
```

### Done!

Use this DB connection URI to work with data
```
  mongodb://localhost:27017
```

When finished, stop the container with
```
  npm run mongo-down
```
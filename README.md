
# Trellzo

The backend for **your new project planning app** ~~ripoff~~.

---

## Run Locally (dev environment)

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

5. Start the conatiners

```bash
  npm run dev-up
```

### Done!

Use this DB connection URI to work with data:
```
  mongodb://localhost:27017
```
and this one to access the API:
```
  http://localhost:3000
```

When finished, stop the containers with
```
  npm run dev-down
```


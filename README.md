
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

4. Generate your local SSL certificate and build the HTTPS proxy

```bash
  npm run https-proxy-build
```

Make sure to follow the instructions at the end of the script's output to exempt your SSL certificate from browser security measures.

5. Start the dev environment

```bash
  npm run dev-up
```

### Done!

Use this DB connection URI to work with data:

`mongodb://localhost:27017`

and this one to access the API:

`https://localhost`

When finished, stop the containers with

```bash
  npm run dev-down
```

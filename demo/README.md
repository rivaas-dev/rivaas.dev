# Regenerating the demo cast files

This folder has a small Rivaas app. You can use it to record the asciinema demos that appear on the [rivaas.dev](https://rivaas.dev) website.

## What you need

- **Go** 1.25 or newer
- **asciinema** (to record the terminal; e.g. `nix-shell -p asciinema` or your package manager)
- **bat** (shows code with colours; needed for the **write** cast)
- **jq** (handles JSON; needed for the **use** cast)
- **expect** (runs the recording automatically; e.g. `nix-shell -p expect` or your package manager)

You also need the Rivaas framework on your machine. This repo assumes the [rivaas](https://github.com/rivaas-dev/rivaas) repo sits next to it, like this:

```
rivaas-dev/
  rivaas/        # the framework
  rivaas.dev/    # this repo (with demo/ inside)
```

If your folders are different, change the `replace` line in `go.mod` so it points to your Rivaas path.

## Where the cast files go

When you’re done recording, the three files should end up here:

**`src/public/casts/`**

- `write.cast` — the code on screen (with bat for colours)
- `run.cast` — the app starting up and showing the banner
- `use.cast` — calling the OpenAPI and metrics endpoints

## Recording with the scripts (easy way)

From the **`demo/`** folder you can record everything without typing yourself:

```bash
# Record one cast
expect scripts/record-write.exp   # → ../src/public/casts/write.cast
expect scripts/record-run.exp     # → ../src/public/casts/run.cast
./scripts/record-use.sh           # starts the server, records use.cast, then stops it

# Record all three in one go
./scripts/record-all.sh
```

You need `expect`, `asciinema`, `bat`, `jq`, and `go` installed. Run the commands from `demo/`. The `.cast` files are written to `src/public/casts/`.

---

## 1. write.cast (show the code)

This cast shows `main.go` with syntax highlighting (using **bat**).

1. Open a terminal in `demo/` and start recording:

   ```bash
   asciinema rec --overwrite --cols 100 --rows 40 ../src/public/casts/write.cast
   ```

2. Run:

   ```bash
   bat --style=plain --color=always --paging=never main.go
   ```

3. Wait a second or two so people can read the output.
4. Type `exit` or press **Ctrl+D**. The cast is saved to `src/public/casts/write.cast`.

---

## 2. run.cast (show the startup banner)

This cast shows the app starting and the banner with the route table.

1. In `demo/`, start recording:

   ```bash
   asciinema rec --overwrite --cols 100 --rows 40 ../src/public/casts/run.cast
   ```

2. Run the app:

   ```bash
   go run main.go
   ```

3. Wait until the banner and route table are fully visible (and any log lines you want).
4. Stop the server with **Ctrl+C**.
5. Type `exit` or press **Ctrl+D** to finish the recording.

---

## 3. use.cast (show docs and metrics)

This cast shows that the API is running by calling the OpenAPI spec and the metrics endpoint.

1. **Terminal 1** — start the app and keep it running:

   ```bash
   cd demo
   go run main.go
   ```

2. **Terminal 2** — go to the **rivaas.dev** repo root and start recording:

   ```bash
   cd /path/to/rivaas.dev
   asciinema rec --overwrite --cols 100 --rows 40 src/public/casts/use.cast
   ```

3. Run:

   ```bash
   curl -s http://localhost:8080/openapi.json | jq -C
   ```

   Wait about a second, then:

   ```bash
   curl -s http://localhost:9090/metrics | head -5
   ```

4. Wait a second or two, then type `exit` or press **Ctrl+D** to end the recording.

5. In Terminal 1, stop the server with **Ctrl+C**.

---

## Quick reference

| Cast    | Where to run `asciinema rec` | What to do while recording |
|--------|------------------------------|-----------------------------|
| **write** | `demo/`                 | `bat --style=plain --color=always --paging=never main.go`, then exit |
| **run**   | `demo/`                 | `go run main.go`, wait for banner, Ctrl+C, exit |
| **use**   | any (with server in another terminal) | `curl ... \| jq -C`, then `curl ... \| head -5`, then exit |

If you recorded the casts somewhere else, copy or move the `.cast` files into `src/public/casts/`. Then rebuild the site with `npm run build` in the repo root.

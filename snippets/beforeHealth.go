// Manual: signal handling
go func() {
    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, syscall.SIGHUP)
    for range sigCh {
        if err := cfg.Reload(); err != nil {
            log.Printf("reload failed: %v", err)
        }
    }
}()

// Manual: health endpoint
http.HandleFunc("/health", func(
    w http.ResponseWriter,
    r *http.Request,
) {
    if db.Ping() != nil {
        w.WriteHeader(503)
        return
    }
    w.WriteHeader(200)
})

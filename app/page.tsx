export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ margin: 0 }}>SCENT Demo</h1>
      <p style={{ marginTop: 12, color: "#444" }}>
        Starter site scaffold. Admin dashboard is currently open (no auth).
      </p>

      <a
        href="/admin"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #ddd",
          textDecoration: "none",
          color: "#111",
        }}
      >
        Go to /admin
      </a>
    </main>
  );
}


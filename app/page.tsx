export default function Home() {
  return (
    <main style={styles.page}>
      <header style={styles.nav}>
        <div style={styles.logo}>LUXE</div>
        <div style={styles.links}>
          <a href="#">Shop</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="/admin">Admin</a>
        </div>
      </header>

      <section style={styles.hero}>
        <h1 style={styles.title}>Quiet Luxury</h1>
        <p style={styles.subtitle}>Minimal essentials designed for everyday wear.</p>
        <button style={styles.button}>Shop Collection</button>
      </section>

      <section style={styles.grid}>
        {["Hoodie", "Tee", "Crewneck", "Cap"].map((item) => (
          <div key={item} style={styles.card}>
            <div style={styles.image} />
            <h3 style={{ margin: "10px 0 6px" }}>{item}</h3>
            <p style={{ margin: 0, color: "#aaa" }}>Premium Essential</p>
          </div>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#0b0b0b",
    color: "#fff",
    fontFamily: "Arial",
    minHeight: "100vh",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    borderBottom: "1px solid #222",
    alignItems: "center",
  },
  logo: {
    letterSpacing: "6px",
    fontSize: "18px",
  },
  links: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
  },
  hero: {
    textAlign: "center",
    padding: "120px 20px",
  },
  title: {
    fontSize: "52px",
    fontWeight: "300",
    margin: 0,
  },
  subtitle: {
    color: "#aaa",
    marginTop: "10px",
  },
  button: {
    marginTop: "25px",
    padding: "12px 24px",
    background: "#fff",
    color: "#000",
    border: "none",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    padding: "40px",
  },
  card: {
    background: "#111",
    padding: "20px",
    border: "1px solid #222",
  },
  image: {
    height: "140px",
    background: "#1a1a1a",
    marginBottom: "10px",
  },
};


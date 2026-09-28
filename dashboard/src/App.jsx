import { useEffect, useMemo, useState } from "react";
import "./App.css";

// Known locations per school (the scraped JSON doesn't store this).
const LOCATIONS = {
  "Chamisso-Grundschule": "Berlin-Reinickendorf",
  "Campus Hannah Höch": "Berlin-Reinickendorf",
  "Bettina-von-Arnim-Schule": "Berlin-Reinickendorf",
  "Lauterbach-Schulen": "Berlin",
  "Peckwisch-Grundschule": "Berlin-Reinickendorf",
};

// The dashboard is deployed under a base path on GitHub Pages,
// so we build the events.json URL relative to that base.
const DATA_URL = `${import.meta.env.BASE_URL}events.json`;

function formatLastChecked(iso) {
  if (!iso) return "unbekannt";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Transform the scraped payload into the shapes the UI needs.
function transform(payload) {
  const rawSchools = payload?.schools ?? [];

  const schools = rawSchools.map((s) => ({
    name: s.name,
    location: LOCATIONS[s.name] ?? "Berlin",
    status: s.status ?? "Online",
    events: (s.events ?? []).length,
  }));

  const events = rawSchools.flatMap((s) =>
    (s.events ?? []).map((e) => ({
      school: s.name,
      title: e.title,
      date: e.date,
      time: e.time ?? "",
      type: e.type ?? [],
      url: e.url ?? "",
      new: Boolean(e.new),
    })),
  );

  return { schools, events, lastChecked: payload?.last_checked ?? null };
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("Alle Schulen");
  const [typeFilter, setTypeFilter] = useState("Alle Arten");

  const [data, setData] = useState({
    schools: [],
    events: [],
    lastChecked: null,
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(DATA_URL, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        if (!active) return;
        setData(transform(payload));
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const schools = data.schools;
  const events = data.events;


    const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const title = event.title ?? "";
        const matchesSearch =
          title.toLowerCase().includes(search.toLowerCase()) ||
          event.school.toLowerCase().includes(search.toLowerCase());

        const matchesSchool =
          schoolFilter === "Alle Schulen" || event.school === schoolFilter;

        const matchesType =
          typeFilter === "Alle Arten" || event.type.includes(typeFilter);

        return matchesSearch && matchesSchool && matchesType;
      }),
    [events, search, schoolFilter, typeFilter],
  );

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">🏫</div>

            <div>
              <h1>School Open Day in Reinickendorf</h1>
              <p>Schulveranstaltungen in Berlin</p>
            </div>
          </div>

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Hell" : "🌙 Dunkel"}
          </button>
        </div>
      </header>

      <nav className="breadcrumb">
        <div className="breadcrumb-inner">
          Startseite › Schulmonitoring › <span>Berlin-Reinickendorf</span>
        </div>
      </nav>

      <main className="container">
                <section className="hero">
          <div className="hero-inner">
            <div className="hero-text-block">
              <p className="eyebrow">Schulmonitoring Berlin</p>
              <h2>
                Tage der offenen Tür
                <br />
                in Reinickendorf
              </h2>
              <p className="hero-text">
                Automatische Überwachung der Schulwebseiten — neue Termine
                und Veranstaltungen werden täglich erkannt und hier angezeigt.
              </p>
            </div>
            <div className="last-check">
              <span className="status-dot"></span>
              <div>
                <strong>{loadError ? "Keine Daten" : "System aktiv"}</strong>
                <small>
                  {loadError
                    ? "Daten nicht verfügbar"
                    : `Zuletzt geprüft: ${formatLastChecked(data.lastChecked)}`}
                </small>
              </div>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon">🏫</div>
            <div>
              <span>Schulen</span>
              <strong>{schools.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div>
              <span>Veranstaltungen</span>
              <strong>{events.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✨</div>
            <div>
              <span>Neue Events</span>
              <strong>{events.filter((event) => event.new).length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div>
              <span>Online</span>
              <strong>{schools.length}</strong>
            </div>
          </div>
        </section>

        <section className="section">
                    <div className="section-title">
            <h2>🏫 Überwachte Schulen</h2>
            <p>Aktueller Status der überwachten Webseiten</p>
          </div>

          <div className="school-grid">
            {schools.map((school) => (
              <div className="school-card" key={school.name}>
                <div className="school-card-top">
                  <div className="school-icon">🏫</div>

                  <span className="online-badge">
                    <span></span>
                    {school.status}
                  </span>
                </div>

                <h3>{school.name}</h3>
                <p>{school.location}</p>

                <div className="school-footer">
                  <span>Gefundene Events</span>
                  <strong>{school.events}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
                    <div className="section-title">
            <h2>📅 Erkannte Veranstaltungen</h2>
            <p>Gefundene Termine und Schulveranstaltungen</p>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="🔎 Schule oder Veranstaltung suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
            >
              <option>Alle Schulen</option>
              {schools.map((school) => (
                <option key={school.name}>{school.name}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>Alle Arten</option>
              <option>Schulführung</option>
              <option>Informationsveranstaltung</option>
              <option>Tag der offenen Tür</option>
            </select>
          </div>

                    <div className="event-list">
            {loading ? (
              <div className="empty">Daten werden geladen …</div>
            ) : filteredEvents.length === 0 ? (
              <div className="empty">
                {loadError
                  ? "Konnte Veranstaltungen nicht laden."
                  : "Keine Veranstaltungen gefunden."}
              </div>
            ) : (
              filteredEvents.map((event, index) => (
                <article className="event-card" key={index}>
                  <div className="event-date">
                    <strong>{event.date.split(".")[0]}</strong>
                    <span>
                      {event.date.includes(".")
                        ? event.date.split(".")[1] + "."
                        : ""}
                    </span>
                  </div>

                  <div className="event-content">
                    <div className="event-top">
                      <span className="school-label">{event.school}</span>

                      {event.new && <span className="new-badge">NEU</span>}
                    </div>

                    <h3>{event.title}</h3>

                    {event.time && (
                      <p className="event-time">🕐 {event.time}</p>
                    )}

                    <div className="event-types">
                      {event.type.map((type) => (
                        <span key={type}>{type}</span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="details-button"
                    onClick={() => event.url && window.open(event.url, "_blank", "noopener,noreferrer")}
                    disabled={!event.url}
                  >
                    Details →
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>School Open Day in Reinickendorf · Schulmonitoring Berlin</p>
      </footer>
    </div>
  );
}

export default App;
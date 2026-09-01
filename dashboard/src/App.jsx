import { useState } from "react";
import "./App.css";

const schools = [
  {
    name: "Chamisso-Grundschule",
    location: "Berlin-Reinickendorf",
    status: "Online",
    events: 0,
  },
  {
    name: "Campus Hannah Höch",
    location: "Berlin-Reinickendorf",
    status: "Online",
    events: 2,
  },
  {
    name: "Bettina-von-Arnim-Schule",
    location: "Berlin-Reinickendorf",
    status: "Online",
    events: 1,
  },
  {
    name: "Lauterbach-Schulen",
    location: "Berlin",
    status: "Online",
    events: 0,
  },
];

const events = [
  {
    school: "Campus Hannah Höch",
    title:
      "Informationsveranstaltungen und Schulführungen für das Schuljahr 2027/28",
    date: "10.09.2026",
    time: "17:00–18:00",
    type: ["Schulführung", "Informationsveranstaltung"],
    new: true,
  },
  {
    school: "Campus Hannah Höch",
    title:
      "Informationsveranstaltungen und Schulführungen für das Schuljahr 2027/28",
    date: "11.09.2026",
    time: "09:00–10:00",
    type: ["Schulführung", "Informationsveranstaltung"],
    new: true,
  },
  {
    school: "Bettina-von-Arnim-Schule",
    title: "Tag der offenen Tür",
    date: "Noch nicht erkannt",
    time: "",
    type: ["Tag der offenen Tür"],
    new: false,
  },
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("Alle Schulen");
  const [typeFilter, setTypeFilter] = useState("Alle Arten");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.school.toLowerCase().includes(search.toLowerCase());

    const matchesSchool =
      schoolFilter === "Alle Schulen" || event.school === schoolFilter;

    const matchesType =
      typeFilter === "Alle Arten" || event.type.includes(typeFilter);

    return matchesSearch && matchesSchool && matchesType;
  });

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">🏫</div>

            <div>
              <h1>School Event Monitor</h1>
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

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">SCHULMONITORING</p>

            <h2>
              Wichtige Schultermine
              <br />
              automatisch entdecken.
            </h2>

            <p className="hero-text">
              Der Monitor überprüft die Webseiten ausgewählter Schulen und
              erkennt neue Veranstaltungen und wichtige Termine.
            </p>
          </div>

          <div className="last-check">
            <span className="status-dot"></span>
            <div>
              <strong>System online</strong>
              <small>Zuletzt geprüft: gerade eben</small>
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
            <div>
              <h2>Überwachte Schulen</h2>
              <p>Aktueller Status der überwachten Webseiten</p>
            </div>
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
            <div>
              <h2>Veranstaltungen</h2>
              <p>Erkannte Schulveranstaltungen und Termine</p>
            </div>
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
            {filteredEvents.length === 0 ? (
              <div className="empty">
                Keine Veranstaltungen gefunden.
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

                  <button className="details-button">Details →</button>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>School Event Monitor · Chamisso-Grundschule Project</p>
      </footer>
    </div>
  );
}

export default App;
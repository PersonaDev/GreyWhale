import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Route, Switch } from "wouter";

type RoadmapItem = [id: string, title: string, description: string];

const board: Array<{ name: string; tone: string; items: RoadmapItem[] }> = [
  {
    name: "Planned",
    tone: "blue",
    items: [
      [
        "public-project-notes",
        "Public project notes",
        "Short technical notes when a project produces something worth explaining.",
      ],
      [
        "a-clearer-view-of-current-projects",
        "A clearer view of current projects",
        "A small directory for Greywhale projects that are ready to be public.",
      ],
    ],
  },
  {
    name: "In progress",
    tone: "purple",
    items: [
      [
        "custom-crm-and-lead-management",
        "Custom CRM and lead management",
        "Client-specific systems for intake, pipelines, follow-up and reporting.",
      ],
      [
        "legal-intake-and-workflow-tools",
        "Legal intake and workflow tools",
        "Focused tools for the work around practice-management and document systems.",
      ],
    ],
  },
  {
    name: "Complete",
    tone: "green",
    items: [
      [
        "greywhale-feedback-board",
        "Greywhale feedback board",
        "A public roadmap with voting and a place to submit requests.",
      ],
      [
        "omni-project-page",
        "Omni project page",
        "The public home for Greywhale’s personal health record project.",
      ],
    ],
  },
];

function Shell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "site roadmap-site" : "site"}>
      <header className="brand">
        <a className="brand-link" href="/" aria-label="Greywhale.dev home">
          <img
            className="wordmark"
            src="/greywhale-software.svg"
            alt="Greywhale Software"
          />
        </a>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <nav aria-label="Footer">
          <a href="/roadmap">Roadmap</a>
          <a href="/feature-requests">Feature requests</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
        <span>© 2026 Greywhale Software LLC</span>
      </footer>
    </div>
  );
}

function Tabs({ active }: { active: "roadmap" | "requests" }) {
  return (
    <nav className="feedback-nav" aria-label="Feedback">
      <a className={active === "roadmap" ? "active" : ""} href="/roadmap">
        Roadmap
      </a>
      <a
        className={active === "requests" ? "active" : ""}
        href="/feature-requests"
      >
        Feature requests
      </a>
    </nav>
  );
}

function Home() {
  return (
    <Shell>
      <h1>Custom CRM and lead-generation software.</h1>
      <p className="intro">
        Greywhale Software builds and maintains internal systems for specific
        workflows. Much of the work concerns intake, research, review, follow-up
        and reporting.
      </p>

      <section>
        <h2>Where custom software helps</h2>
        <p>
          A process may begin in a shared inbox, move into a spreadsheet and end
          with a report assembled by hand. Important context sits in email, the
          same information is entered twice, and one person has to remember what
          the software does not.
        </p>
        <p>
          Greywhale builds the missing system around that work. It can be a full
          CRM or a smaller tool for intake, research, review, reporting or
          follow-up.
        </p>
      </section>

      <section>
        <h2>For legal administrators</h2>
        <p>
          Legal administrators often have to make several systems behave like
          one. New inquiries arrive through different channels. Referral
          relationships, follow-up and marketing attribution are tracked
          separately.
        </p>
        <p>
          A custom system can follow the firm’s own language and rules: intake
          status, source, responsible person, next action and the reporting the
          team already owes.
        </p>
      </section>

      <section>
        <h2>CRM and lead management</h2>
        <p>
          A useful CRM makes the next action obvious. That may mean unusual
          stages, separate review queues, strict ownership rules or reports that
          a general-purpose CRM cannot produce without repair.
        </p>
      </section>

      <section>
        <h2>How a project begins</h2>
        <p>
          You do not need a formal requirements document. A useful first
          conversation covers what arrives, who touches it, where it goes next
          and what currently gets missed.
        </p>
      </section>

      <section>
        <h2>Data, access and handoff</h2>
        <p>
          If a system touches client, prospect or matter information, access and
          record ownership have to be decided early. The software should remain
          understandable after launch.
        </p>
      </section>

      <section>
        <h2>Other Greywhale work</h2>
        <p>
          Not every project is client software.{" "}
          <a href="https://omni.greywhale.dev">Omni</a> is a personal health
          record and tracking project.
        </p>
      </section>
    </Shell>
  );
}

function LegalPage({ terms = false }: { terms?: boolean }) {
  return (
    <Shell>
      <h1>{terms ? "Terms of use" : "Privacy policy"}</h1>
      <p className="intro">
        {terms
          ? "These terms apply when you visit Greywhale.dev. Separate agreements govern paid work and client projects."
          : "This page explains what information Greywhale Software LLC handles when you visit Greywhale.dev."}
      </p>
      <p className="updated">Effective September 8, 2026</p>

      <section>
        <h2>
          {terms ? "Using this website" : "Information this website handles"}
        </h2>
        <p>
          {terms
            ? "You may browse and link to this website for lawful purposes. Do not interfere with its operation or attempt unauthorized access."
            : "Greywhale.dev does not offer user accounts or use advertising trackers or marketing cookies. Our host may process ordinary technical request data to deliver and protect the site."}
        </p>
      </section>

      <section>
        <h2>
          {terms ? "Feedback and requests" : "Feature requests and voting"}
        </h2>
        <p>
          {terms
            ? "Do not submit confidential, privileged or client-identifying information. Submitted ideas may be reviewed and used without an obligation to build or pay for them."
            : "The request form stores its category, title, details and submission time. Voting uses a random browser identifier to prevent duplicate votes. Do not include confidential client, matter or health information."}
        </p>
      </section>

      {terms && (
        <section>
          <h2>Information and availability</h2>
          <p>
            This site provides general information, not legal or other
            professional advice. It may change or be unavailable without notice.
            Links to other sites are provided for convenience and do not make
            Greywhale responsible for their content.
          </p>
        </section>
      )}

      <section>
        <h2>Client and product data</h2>
        <p>
          Client projects and Greywhale products may be covered by separate
          agreements or privacy notices. This page covers this website only.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Use the <a href="/feature-requests">request form</a> and choose
          “Privacy or legal.”
        </p>
      </section>
    </Shell>
  );
}

function Roadmap() {
  const [query, setQuery] = useState("");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const columns = useMemo(
    () =>
      board.map((column) => ({
        ...column,
        items: column.items.filter((item) =>
          item.join(" ").toLowerCase().includes(query.toLowerCase()),
        ),
      })),
    [query],
  );

  useEffect(() => {
    fetch("/api/feedback")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setVotes(data.votes || {}))
      .catch(() => {});
  }, []);

  async function vote(itemId: string) {
    let voterKey = localStorage.getItem("greywhale-voter-key");
    if (!voterKey) {
      voterKey = crypto.randomUUID();
      localStorage.setItem("greywhale-voter-key", voterKey);
    }
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "vote", itemId, voterKey }),
    });
    if (response.ok) {
      const data = await response.json();
      setVotes((current) => ({ ...current, [itemId]: data.votes }));
      setVoted((current) => ({ ...current, [itemId]: true }));
    }
  }

  return (
    <Shell wide>
      <Tabs active="roadmap" />
      <div className="portal-heading">
        <div>
          <h1>Roadmap</h1>
          <p>Plans can move. Client work is listed only in general terms.</p>
        </div>
        <div className="roadmap-search">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Search roadmap"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="roadmap-columns">
        {columns.map((column) => (
          <section className="roadmap-column" key={column.name}>
            <header>
              <h2>
                <span className={`status-dot ${column.tone}`} />
                {column.name}
              </h2>
              <span>{column.items.length}</span>
            </header>
            <div className="roadmap-cards">
              {column.items.map(([id, title, description]) => (
                <article className="roadmap-card" key={id}>
                  <button
                    className={`vote-button ${voted[id] ? "voted" : ""}`}
                    type="button"
                    onClick={() => vote(id)}
                    aria-label={`Vote for ${title}`}
                  >
                    <span aria-hidden="true">⌃</span>
                    <span>{votes[id] || 0}</span>
                  </button>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
              {column.items.length === 0 && (
                <p className="column-empty">No matching items.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}

type PublicRequest = {
  id: string;
  title: string;
  status: string;
  createdAt: number;
};

function FeatureRequests() {
  const [requests, setRequests] = useState<PublicRequest[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/feedback")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setRequests(data.requests || []))
      .catch(() => {});
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("Submitting…");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "Could not submit request.");
        return;
      }
      if (result.request?.kind === "feature")
        setRequests((current) => [result.request, ...current]);
      form.reset();
      setMessage("Request received.");
    } catch {
      setMessage("Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Shell wide>
      <Tabs active="requests" />
      <div className="request-heading">
        <h1>Feature requests</h1>
        <p className="portal-copy">
          Describe the work first. A proposed feature is optional.
        </p>
      </div>

      <div className="request-layout">
        <form className="request-form" onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="request-kind">Type</label>
            <select id="request-kind" name="kind">
              <option value="feature">Feature request</option>
              <option value="legal">Privacy or legal</option>
              <option value="general">General message</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="request-title">Title</label>
            <input
              id="request-title"
              name="title"
              minLength={5}
              maxLength={120}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="request-details">Details</label>
            <textarea
              id="request-details"
              name="details"
              minLength={20}
              maxLength={2000}
              required
            />
          </div>
          <label className="honeypot" aria-hidden="true">
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <p className="form-note">
            Do not include confidential client, matter or health information.
          </p>
          <button
            className="submit-request"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit request"}
          </button>
          {message && <p className="form-message">{message}</p>}
        </form>

        <section className="recent-requests">
          <h2>Recent requests</h2>
          {requests.length === 0 && (
            <p className="empty-requests">No requests yet.</p>
          )}
          {requests.map((request) => (
            <article className="request-summary" key={request.id}>
              <div>
                <h3>{request.title}</h3>
                <span>Received</span>
              </div>
              <time dateTime={new Date(request.createdAt).toISOString()}>
                {new Date(request.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </article>
          ))}
        </section>
      </div>
    </Shell>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/feature-requests" component={FeatureRequests} />
      <Route path="/privacy">
        <LegalPage />
      </Route>
      <Route path="/terms">
        <LegalPage terms />
      </Route>
      <Route>
        <Home />
      </Route>
    </Switch>
  );
}

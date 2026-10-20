import {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import data from '@site/src/data/events.json';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('ca', {dateStyle: 'long', timeZone: 'UTC'});

function Event({title, date, endDate, place, section, description, link}) {
  return (
    <article className="margin-bottom--lg">
      <h3>{link ? <Link to={link}>{title}</Link> : title}</h3>
      <p className="margin-bottom--sm">
        <strong>
          {formatDate(date)}
          {endDate && ` – ${formatDate(endDate)}`}
        </strong>
        {[place, section].filter(Boolean).map((s) => ` · ${s}`)}
      </p>
      {description && <p>{description}</p>}
    </article>
  );
}

export default function Agenda() {
  // "Today" is set in the browser so past events hide without a rebuild; before hydration all events show.
  const [today, setToday] = useState('');
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  const sorted = [...data.events].sort((a, b) => a.date.localeCompare(b.date));
  const isPast = (e) => (e.endDate || e.date) < today;
  const upcoming = sorted.filter((e) => !isPast(e));
  const past = sorted.filter(isPast).reverse();

  return (
    <Layout title="Agenda" description="Properes activitats del CMES.">
      <main className="container margin-vert--xl">
        <h1>Agenda</h1>
        {upcoming.length ? (
          upcoming.map((e) => <Event key={e.date + e.title} {...e} />)
        ) : (
          <p>Ara mateix no hi ha activitats programades. Torna-hi aviat!</p>
        )}
        {past.length > 0 && (
          <details className="margin-top--lg">
            <summary>Activitats passades</summary>
            {past.map((e) => <Event key={e.date + e.title} {...e} />)}
          </details>
        )}
        <p className="margin-top--lg">
          Consulta les <Link to="/calendari/">normes de participació</Link> a les activitats.
        </p>
      </main>
    </Layout>
  );
}

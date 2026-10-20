import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import site from '@site/src/data/site.json';
import Intro from '@site/src/pages/_inici.md';
import styles from './styles.module.css';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('ca', {dateStyle: 'long', timeZone: 'UTC'});

export default function Home({items}) {
  return (
    <Layout description={site.tagline}>
      <header
        className={styles.hero}
        style={{backgroundImage: `url(${useBaseUrl('/img/hero.jpg')})`}}>
        <img src={useBaseUrl('/img/logo.png')} alt={site.title} />
        <Link className="button button--secondary button--outline button--lg" to="/fes-te-soci/">
          Fes-te soci
        </Link>
      </header>
      <main>
        <section className="container padding-vert--xl text--center">
          <h2>Seccions</h2>
          <div className={styles.sections}>
            {site.sections.map((s) => (
              <Link key={s.to} to={s.to}>{s.label}</Link>
            ))}
          </div>
        </section>
        <section
          className={styles.club}
          style={{backgroundImage: `url(${useBaseUrl('/img/club.jpg')})`}}>
          <div className="container padding-vert--xl">
            <h2>El Club</h2>
            <Intro />
          </div>
        </section>
        <section className="container padding-vert--xl">
          <h2>Actualitat CMES</h2>
          <div className="row">
            {items.slice(0, 4).map(({content: {metadata, assets}}) => (
              <div key={metadata.permalink} className="col col--3 margin-bottom--lg">
                <Link to={metadata.permalink} className={`card ${styles.card}`}>
                  {assets.image && <img src={assets.image} alt="" loading="lazy" />}
                  <div className="card__body">
                    <h3>{metadata.title}</h3>
                    <small>{formatDate(metadata.date)}</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <Link to="/blog/">Totes les notícies »</Link>
        </section>
      </main>
    </Layout>
  );
}

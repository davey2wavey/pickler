import { connect, email, github, site } from "@/content/site";
import { CopyEmail } from "@/components/copy-email";
import styles from "./touch.module.css";

/** The last band: one word, one line, two ways to reach me. */
export function Touch() {
  return (
    <section id="touch" aria-labelledby="touch-title" className={styles.connect}>
      <p className={styles.k}>{connect.eyebrow}</p>
      <h2 id="touch-title" className={styles.title}>
        {connect.title}
      </h2>
      <p className={styles.lead}>{connect.lead}</p>
      <div className={styles.acts}>
        <a className={styles.btn} href={`mailto:${email}`}>
          {connect.email}
        </a>
        <a className={`${styles.btn} ${styles.ghost}`} href={github} rel="noreferrer">
          {connect.github}
        </a>
      </div>
      <span className={styles.mail}>
        <span className="select-all">{email}</span>
        <CopyEmail email={email} />
      </span>
      <p className={styles.foot}>
        <a href="#top">{connect.top}</a> · {site.name} · {site.location}
      </p>
    </section>
  );
}

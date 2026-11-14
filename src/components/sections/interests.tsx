import {
  MachineLearningMark,
  PhysicalAiMark,
  ReinforcementMark,
  ViolinMark,
} from "@/components/interest-art";
import { interests } from "@/data/interests";

const marks = {
  violin: ViolinMark,
  "physical-ai": PhysicalAiMark,
  "machine-learning": MachineLearningMark,
  "reinforcement-learning": ReinforcementMark,
} as const;

export function Interests() {
  return (
    <section
      id="interests"
      className="section-shell interests"
      aria-labelledby="interests-title"
    >
      <div className="section-head split-phi">
        <div>
          <h2 id="interests-title">What I keep returning to</h2>
          <p className="section-lede">
            Four practices, drawn as instruments. The work below is the public
            record of the same habits.
          </p>
        </div>
        <p className="section-aside">
          Violin varnish on one side of the glass. Learning systems on the other.
        </p>
      </div>
      <div className="interest-grid">
        {interests.map((item) => {
          const Mark = marks[item.id];
          return (
            <article
              key={item.id}
              id={item.id}
              className="interest-lens glass"
              data-tone={item.tone}
            >
              <div className="interest-art">
                <Mark title={item.title} />
              </div>
              <h3>{item.title}</h3>
              <p className="interest-line">{item.line}</p>
              <p>{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

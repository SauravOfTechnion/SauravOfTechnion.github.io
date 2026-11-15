import {
  MachineLearningMark,
  PhysicalAiMark,
  ReinforcementMark,
  ViolinMark,
} from "@/components/interest-art";
import { interests } from "@/data/interests";
import { ObjectLab } from "@/components/object-lab";

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
      <div className="manifesto">
        <p className="chapter-label">The through-line</p>
        <h2 id="interests-title">A string finds its resonance.<br />An aircraft finds its path.<br />A machine learns its world.</h2>
        <p>Different systems. The same beautiful problem: sensing what is happening,
          deciding what comes next, and learning from the answer.</p>
      </div>
      <div className="instrument-chapter">
      <div className="section-head">
        <div>
          <p className="chapter-label">Beyond the equations</p>
          <h2>It starts<br />with listening.</h2>
          <p className="section-lede">
            From the resonance of a string to a machine learning to navigate.
            These are the worlds I keep coming back to.
          </p>
        </div>
        <p className="section-aside">
          Music taught me to listen. Engineering taught me to ask why.
        </p>
      </div>
      <ObjectLab />
      </div>
      <div className="interest-grid">
        {interests.map((item) => {
          const Mark = marks[item.id];
          return (
            <article
              key={item.id}
              id={item.id}
              className="interest-lens"
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

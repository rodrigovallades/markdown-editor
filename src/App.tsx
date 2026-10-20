import { useState } from 'react';
import { MarkdownRendererInlineEdit } from './components/markdown-renderer-inline-edit';

const initialMarkdown = `# Insight #2293: Abrupt Vibration Increase

**Severity:** Danger for 27d 49min  
**Asset:** RPA-8141401-D - REDUTOR VENTILADOR TORRE DE RESFRIAMENTO 4 [RPA-8141401D]  
**Analysis period:** 21–23 Sep 2026  
**Detected:** 23 Sep 2026 at 15:10

## Diagnostic summary

An abrupt increase in **velocity (RMS)** on the vertical axis is **3.3× higher** than this machine's operating history. This sudden change needs prompt investigation to reduce the risk of equipment damage. See the [vibration trend in Analytics](https://example.com/analytics).

Inline formatting examples: **high priority**, *monitor closely*, ~~normal operating range~~, and \`velocity_rms\`.

### Measurement history

The table compares recent readings from the fan reducer with the historical baseline. Values are illustrative readings for this diagnostic example.

| Timestamp | Measurement point | Axis | Velocity RMS (mm/s) | Historical baseline (mm/s) | Change | Status |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 21 Sep 2026, 00:00 | Reducer input bearing | Vertical | 1.18 | 1.20 | 0.98× | Normal |
| 21 Sep 2026, 06:00 | Reducer input bearing | Vertical | 1.22 | 1.20 | 1.02× | Normal |
| 21 Sep 2026, 12:00 | Reducer input bearing | Vertical | 1.16 | 1.20 | 0.97× | Normal |
| 21 Sep 2026, 18:00 | Reducer input bearing | Vertical | 1.25 | 1.20 | 1.04× | Normal |
| 22 Sep 2026, 00:00 | Reducer input bearing | Vertical | 1.21 | 1.20 | 1.01× | Normal |
| 22 Sep 2026, 06:00 | Reducer input bearing | Vertical | 1.27 | 1.20 | 1.06× | Normal |
| 22 Sep 2026, 12:00 | Reducer input bearing | Vertical | 1.19 | 1.20 | 0.99× | Normal |
| 22 Sep 2026, 18:00 | Reducer input bearing | Vertical | 1.24 | 1.20 | 1.03× | Normal |
| 23 Sep 2026, 06:00 | Reducer input bearing | Vertical | 1.23 | 1.20 | 1.03× | Normal |
| 23 Sep 2026, 09:00 | Reducer input bearing | Vertical | 1.31 | 1.20 | 1.09× | Elevated |
| 23 Sep 2026, 12:00 | Reducer input bearing | Vertical | 1.74 | 1.20 | 1.45× | Increasing |
| 23 Sep 2026, 14:00 | Reducer input bearing | Vertical | 2.48 | 1.20 | 2.07× | High |
| 23 Sep 2026, 15:10 | Reducer input bearing | Vertical | 3.96 | 1.20 | 3.30× | Danger |
| 23 Sep 2026, 15:20 | Reducer output bearing | Vertical | 3.42 | 1.10 | 3.11× | Danger |
| 23 Sep 2026, 15:30 | Fan-side bearing | Vertical | 2.91 | 1.05 | 2.77× | High |
| 23 Sep 2026, 15:40 | Reducer input bearing | Horizontal | 1.38 | 1.25 | 1.10× | Normal |

#### Diagnostic interpretation

The readings stayed close to baseline through most of the analysis period, then rose quickly on 23 September. The highest value was recorded at the reducer input bearing. The horizontal-axis reading did not show a comparable increase.

##### Potential causes to check

- A process or load change shortly before the event
- Looseness at the reducer base or bearing housing
- Bearing wear, damage, or inadequate lubrication
- Dirt buildup or a foreign object affecting the assembly

###### Reading the status values

The change column is the measured velocity divided by its historical baseline. A value near **1.0×** is close to normal history; the latest **3.30×** reading is a marked departure. Use the measured trend and an on-site assessment when deciding how to respond.

### Recommendations

1. **Operational assessment:** Check for changes in process, load, speed, or operating conditions immediately before the increase.
2. **Condition inspection:** If no operational change explains the event, inspect the machine's physical condition.
   - **Critical machines:** Stop the machine as soon as it is safe to do so, then inspect it.
   - **Non-critical equipment:** Inspection may proceed during operation if site procedures allow it.
3. **Diagnostic inspection:**
   - **Visual:** Check for dirt accumulation, damage, oil leakage, and loose or missing bolts.
   - **Auditory:** Listen for abnormal noise from the reducer and bearings.
   - **Mounting:** Verify the base fixation, bearing housings, and mounting bolt tightness.
   - **Lubrication:** Check lubricant condition and confirm the correct level and type.
4. **Record findings:** Add inspection results, operating context, and any corrective work to the insight feedback section.

### Inspection checklist

- [ ] Confirm whether the load, speed, or process changed before the event.
- [ ] Inspect reducer input and output bearings.
- [ ] Check mounting bolts, base fixation, and lubrication.
- [ ] Record findings and attach supporting photos or measurements.

### Signal snapshot

\`\`\`text
Asset:       RPA-8141401-D
Metric:      Velocity RMS
Axis:        Vertical
Latest:      3.96 mm/s
Baseline:    1.20 mm/s
Change:      3.30x
Detected:    2026-09-23 15:10
\`\`\`

---

**Next step:** Review the trend in [Analytics](https://example.com/analytics), assess the machine's criticality, and follow the applicable site safety procedure before inspection.`;

const alternateMarkdown = `## A fresh start

This content was loaded from outside the editor.

- Markdown is the source of truth
- Changes are serialized live`;

export default function App() {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <main className="app-shell">
      <header className="app-header">
        <span className="eyebrow">Remirror + React + Vite</span>
        <h1>Markdown editor</h1>
        <p>A minimal working copy of the edupass-frontend editor, with tables and a live Markdown output.</p>
      </header>

      <div className="demo-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Click the content to edit</h2>
            <span>Click Save to keep changes</span>
          </div>
          <MarkdownRendererInlineEdit
            editable
            markdown={markdown}
            placeholder="Start writing…"
            onSave={async (value) => {
              await new Promise((resolve) => window.setTimeout(resolve, 350));
              setMarkdown(value);
            }}
          />
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Markdown output</h2>
            <span>Live</span>
          </div>
          <pre className="markdown-output">{markdown}</pre>
          <div className="demo-actions">
            <button type="button" onClick={() => setMarkdown(initialMarkdown)}>Reset example</button>
            <button type="button" onClick={() => setMarkdown(alternateMarkdown)}>Load external content</button>
          </div>
        </section>
      </div>
    </main>
  );
}

import { Counter } from "./components/Counter";
import { formatCurrency } from "./utils/formatCurrency";
import "./App.css";

function App() {
  return (
    <main>
      <h1>Practicing testing</h1>
      <p className="intro">
        This app exists to give you two small, focused things to test. It
        isn't meant to look impressive — see <code>README.md</code> for what
        to do.
      </p>

      <section>
        <h2>Price tag</h2>
        <p className="price">{formatCurrency(1499)}</p>
        <p className="hint">
          Formatted by <code>formatCurrency()</code> in{" "}
          <code>src/utils/formatCurrency.ts</code>
        </p>
      </section>

      <section>
        <h2>Counter</h2>
        <Counter />
        <p className="hint">
          Defined in <code>src/components/Counter.tsx</code>
        </p>
      </section>
    </main>
  );
}

export default App;

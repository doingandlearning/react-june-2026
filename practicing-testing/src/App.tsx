import { Counter } from "./components/Counter";
import { formatCurrency } from "./utils/formatCurrency";
import "./App.css";
import { UserCard, type User } from "./components/UserCard";

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
        <h1>Price tag</h1>
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
      <section>
        <h2>User card</h2>
        <p>
          This component fetches a user and displays their name. It is defined in{" "}
          <code>src/components/UserCard.tsx</code>.
        </p>
        <p>
          The fetchUser function is passed in as a prop, so you can mock it in
          your tests.
        </p>
        <UserCard fetchUser={async (): Promise<User> => fetch("https://jsonplaceholder.typicode.com/users/1").then(res => res.json())} />
        <img src="https://picsum.photos/200" alt="Random picture from placeholder API" />

        <div onClick={() => alert("Clicked!")}>Click here</div>
      </section>
      <section>
        <label htmlFor="name_field">
          Full name:
        </label>
        <input id="name_field" type="text" placeholder="Type something..." />
      </section>
    </main>
  );
}

export default App;

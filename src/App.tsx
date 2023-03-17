import { Scheduler } from "./lib";
import { EVENTS } from "./events";

function App() {
  return <Scheduler events={EVENTS} />;
}

export default App;

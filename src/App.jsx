import api from "./services/api";

function App() {

  api.get("/auth/me")
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));

  return (
    <div>
      <h1>Teste</h1>
    </div>
  );
}

export default App;

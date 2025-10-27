import NavBar from "./components/NavBar";
import AppRoutes from "./components/AppRoutes";
import AlertStack from "./components/AlertStack";
import Footer from "./components/Footer";
import StatusChecker from "./components/StatusChecker";

function App() {
  return (
    <StatusChecker>
      <div className="app-container">
        <NavBar />
        <AlertStack />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </StatusChecker>
  );
}

export default App;

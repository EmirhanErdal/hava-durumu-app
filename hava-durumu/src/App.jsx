import { useState } from "react";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [havaDurumu, setHavaDurumu] = useState(null);
  const [arkaPlan, setArkaPlan] = useState(""); 
  const [loading, setLoading] = useState(false);

  const API_KEY = "f8cf4da6103eff40d4996d76bdc84595";

  // Wikipedia görsel fonksiyonu 🖼️
  async function getCityImage(city) {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${city}`);
      const data = await response.json();
      return data.originalimage?.source || ""; 
    } catch (error) {
      console.error("Görsel çekilemedi:", error);
      return "";
    }
  }

  const veriGetir = async (gelenSehir) => {
    setLoading(true);
    try {
      const temizSehir = gelenSehir.trim();
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${temizSehir}&appid=${API_KEY}&units=metric&lang=tr`;
      
      const yanıt = await fetch(url);
      if (!yanıt.ok) throw new Error("Şehir bulunamadı");
      
      const veri = await yanıt.json();

      setHavaDurumu({
        name: veri.name.toUpperCase(),
        temp: Math.round(veri.main.temp),
        humidity: veri.main.humidity,
        description: veri.weather[0].description,
        wind: Math.round(veri.wind.speed * 3.6),
        icon: veri.weather[0].icon
      });

      const gorselUrl = await getCityImage(temizSehir);
      setArkaPlan(gorselUrl);

    } catch (hata) {
      alert("Hata: " + hata.message);
    } finally {
      setLoading(false);
    }
  };

  const appStyle = {
    backgroundImage: arkaPlan 
      ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${arkaPlan}')` 
      : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#2c3e50'
  };

  return (
    <div className="App" style={appStyle}>
      <div className="main-container">
        <h1 className="main-title">Hava Durumu 🌤️</h1>
        <SearchBar onSearch={veriGetir} disabled={loading} />

        {loading && <div className="loader">Veriler Yükleniyor... 🔄</div>}

        {!loading && havaDurumu && (
          <div className="weather-card">
            <h3>{havaDurumu.name}</h3>
            <div className="temp-section">
              <img 
                src={`https://openweathermap.org/img/wn/${havaDurumu.icon}@4x.png`} 
                alt="Hava Durumu" 
                className="weather-img"
              />
              <h1>{havaDurumu.temp}°C</h1>
            </div>
            <p className="desc">{havaDurumu.description.toUpperCase()}</p>
            <div className="details">
              <p>💧 Nem: %{havaDurumu.humidity}</p>
              <p>🌬️ Rüzgar: {havaDurumu.wind} km/s</p>
            </div>
          </div>
        )}
      </div>

      {/* Sağ alt köşedeki imzan ✍️ */}
      <footer className="signature">
        Made by Emirhan Erdal
      </footer>
    </div>
  );
}

export default App;
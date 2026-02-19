import { useState } from "react";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [havaDurumu, setHavaDurumu] = useState(null);
  const [arkaPlan, setArkaPlan] = useState("varsayilan");
  const [loading, setLoading] = useState(false);

  const sehirler = ["istanbul", "Malatya", "Kocaeli", "Giresun", "Şırnak"];
  const API_KEY = "f8cf4da6103eff40d4996d76bdc84595";

  const veriGetir = async (gelenSehir) => {
    setLoading(true);
    try {
      const temizSehir = gelenSehir.trim(); // API Türkçe karakterleri doğrudan kabul eder
      const dosyaAdi = temizSehir.toLowerCase()
        .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
        .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${temizSehir}&appid=${API_KEY}&units=metric&lang=tr`;
      const yanıt = await fetch(url);
      if (!yanıt.ok) throw new Error("Şehir bulunamadı");

      const veri = await yanıt.json();

      setHavaDurumu({
        name: veri.name.toUpperCase(),
        temp: Math.round(veri.main.temp),
        humidity: veri.main.humidity, // 💧 Nem
        description: veri.weather[0].description,
        wind: Math.round(veri.wind.speed * 3.6), // 🌬️ Rüzgar (km/s'ye çevrildi)
        icon: veri.weather[0].icon
      });

      const listeSehir = sehirler.find(s => 
        s.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's') === dosyaAdi
      );
      setArkaPlan(listeSehir ? dosyaAdi : "varsayilan");

    } catch (hata) {
      alert("Hata: " + hata.message);
    } finally {
      setLoading(false);
    }
  };

  const appStyle = {
    backgroundImage: arkaPlan !== "varsayilan"
      ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/${arkaPlan}.jpg')`
      : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className={`App ${arkaPlan === "varsayilan" ? (havaDurumu?.temp > 20 ? "sicak" : "soguk") : ""}`} style={appStyle}>
      <div className="city-buttons">
        {sehirler.map((s) => (
          <button key={s} onClick={() => veriGetir(s)} disabled={loading}>{s}</button>
        ))}
      </div>

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
    </div>
  );
}

export default App;
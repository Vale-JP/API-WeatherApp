"use client";

import { useState, useEffect } from 'react';
import { fetchWeatherData, fetchForecastData } from "../../lib/weather";
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import styles from './weather.module.css';

// Registre todos os componentes do Chart.js
Chart.register(...registerables);

export default function WeatherPage() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!city) {
            setError('Por favor, insira o nome de uma cidade.');
            return;
        }

        const data = await fetchWeatherData(city);
        const forecast = await fetchForecastData(city);
        
        if (!data) {
            setError('Erro ao carregar os dados do clima. Verifique se o nome da cidade está correto.');
            setWeatherData(null);
            setForecastData(null);
            setBackgroundColor('#f0f0f0'); 
        } else {
            setError(null);
            setWeatherData(data);
            setForecastData(forecast);
        }
    };

    useEffect(() => {
        if (weatherData) {
            const condition = weatherData.weather[0].main.toLowerCase();
            switch (condition) {
                case 'clear':
                    setBackgroundColor('#87CEEB'); // Céu limpo
                    break;
                case 'clouds':
                    setBackgroundColor('#B0C4DE'); // Nublado
                    break;
                case 'rain':
                    setBackgroundColor('#4682B4'); // Chuva
                    break;
                case 'snow':
                    setBackgroundColor('#FFFFFF'); // Neve
                    break;
                case 'thunderstorm':
                    setBackgroundColor('#808080'); // Tempestade
                    break;
                default:
                    setBackgroundColor('#f0f0f0'); // Cor padrão
                    break;
            }
        }
    }, [weatherData]);

    const iconUrl = weatherData ? `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` : '';

    // Preparando os dados para o gráfico
    const chartData = {
        labels: forecastData ? forecastData.list.map(item => new Date(item.dt * 1000).toLocaleDateString()) : [],
        datasets: [
            {
                label: 'Temperatura (°C)',
                data: forecastData ? forecastData.list.map(item => item.main.temp) : [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    

    return (
        <div className={styles.wrapper} style={{ backgroundColor }}>
            <div className={styles.container}>
                <h1 className={styles.h1}>Previsão do tempo</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={city}
                        onChange={handleCityChange}
                        placeholder="Digite o nome da cidade"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Buscar</button>
                </form>

                {error && <p className={styles.error}>{error}</p>}

                {weatherData && (
                    <>
                        <h2 className={styles.h2}>Previsão do tempo para {weatherData.name}</h2>
                        <img src={iconUrl} alt={weatherData.weather[0].description} className={styles.weatherIcon} />
                        <p className={styles.p}>Temperatura: {weatherData.main.temp}°C</p>
                        <p className={styles.p}>Condição: {weatherData.weather[0].description}</p>
                        <footer className={styles.footer}>
                            Dados fornecidos por OpenWeather
                        </footer>
                    </>
                )}

                {forecastData && (
                    <div>
                        <h2 className={styles.h2}>Previsão dos Próximos 5 Dias</h2>
                        <Line data={chartData} />
                    </div>
                )}
            </div>
        </div>
    );
}

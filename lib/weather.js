export async function fetchWeatherData(city) {
    const apiKey = '84d8671b04d6e5c07e989d1cf4cafe07';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Falha ao buscar dados do clima');
        }
        const weatherData = await res.json();
        return weatherData;
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        return null;
    }
}

export async function fetchForecastData(city) {
    const apiKey = '84d8671b04d6e5c07e989d1cf4cafe07';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error('Falha ao buscar dados de previsão');
        }
        const forecastData = await res.json();
        return forecastData;
    } catch (error) {
        console.error('Erro ao buscar dados de previsão:', error);
        return null;
    }
}

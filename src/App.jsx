import { useEffect, useState } from "react"
import { BeatLoader } from "react-spinners";

export default function App() {

    const [cityData, setCityData] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData(){
            let data = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=3a7fef278f1c4b4586b135731240401&q=istanbul&days=3&aqi=no&lang=tr`)
            .then(r => r.json())
            setCityData(data)
        }
        fetchData();
    }, [])

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 700);
        return () => clearTimeout(timer);
    }, [cityData])

    async function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        let data = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=3a7fef278f1c4b4586b135731240401&q=${formObj.city}&days=3&aqi=no&lang=tr`)
        .then(r => r.json())
        if(data.error) {
            setError(true);
        } else {
            setCityData(data)
        }
    }

    return (
        <div className="full-page">

            <div className="container">

                <form onSubmit={handleSearch} className="form">
                    <h1>Hava Durumu</h1>
                    <div>
                        <input type="text" placeholder="Şehir giriniz..." name="city" autoComplete="off" required/>
                        <button>Ara</button>
                    </div>
                </form>

                {
                    error ?
                    <div className="error-box">
                        <button onClick={() => (setError(false))}><i className="fa-solid fa-xmark"></i></button>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <p>Sonuç bulunamadı. Tekrar deneyiniz!</p>
                    </div>
                    :
                

                <div className="results">
                    {
                        loading ?
                        <BeatLoader color="#fff" />
                        :
                        cityData &&
                        <>
                            <h3>{cityData?.location.name} / {cityData?.location.country}</h3>
                            <h1>{String(cityData?.current.temp_c).slice(0,2)}°</h1>
                            <p>{cityData?.current.condition.text}</p>
                        </>
                    }
                </div>
                }

            </div>

        </div>
    )
}
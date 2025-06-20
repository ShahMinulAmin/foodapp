import { useEffect, useState } from "react"

export default function Search({foodData, setFoodData}) {
    const URL = "https://api.spoonacular.com/recipes/complexSearch"
    const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY

    const [query, setQuery] = useState("pizza")

    useEffect(() => {
        fetchFood()
    }, [query])

    async function fetchFood() {
        const res = await fetch(`${URL}?query=${query}&apiKey=${API_KEY}`)
        const data = await res.json()
        setFoodData(data.results)
    }

    return (
        <div>
            <input 
                value={query} 
                onChange={(e)=>setQuery(e.target.value)} 
                type="text"
            />
        </div>
    )
}
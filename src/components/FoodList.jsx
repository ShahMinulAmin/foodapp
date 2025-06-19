import FoodItem from "./FoodItem";

export default function FoodList({setFoodId, foodData}) {
    return <div>
        {foodData.map((food) => (
            <FoodItem key={food.title} food={food} setFoodId={setFoodId}/>
        ))}
    </div>
}
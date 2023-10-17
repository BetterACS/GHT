import { useEffect, useState } from "react"
import axios from 'axios'
import {Config} from '../../../backend/src/config'

interface Monster {
  id: number;
  name: string;
  element: string;
  rarity: string;
  tameable: boolean;
  tameRate: number;
  favoriteFoods: string[];
  dislikes: string[];
}

const Monster = () => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:${Config.PORT}/monster`)
      .then((response) => {
        setMonsters(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [])

  return (
    <>
      <h1>Monster</h1>
     
      {isLoading ? (
        // If the data is still loading, display a loading message
        <p>Loading...</p>
      ) : (
        // Extract monster data from the array of monsters
        <div>
          {monsters.map((monster) => (
            <div key={monster.id}>
              <h2>{monster.name}</h2>
              <p>Element: {monster.element}</p>
              <p>Rarity: {monster.rarity}</p>
              <p>Tameable: {monster.tameable ? "Yes" : "No"}</p>
              <p>Tame Rate: {monster.tameRate}</p>
              <p>Favorite Foods: {monster.favoriteFoods.join(', ')}</p>
              <p>Dislikes: {monster.dislikes.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
};

export default Monster;

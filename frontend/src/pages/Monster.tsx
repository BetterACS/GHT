import { useEffect, useState } from "react"
import axios from 'axios'
import {Config} from '../../../backend/src/config'

// Define the Monster interface
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

/**
 * The Monster component displays a list of monsters.
 */
const Monster = () => {
  /**
   * @Args monsters: An array of Monster objects
   * @Args setMonsters: A function that updates the monsters array
   * 
   * @Args isLoading: A boolean that indicates whether the data is still loading
   * @Args setIsLoading: A function that updates the isLoading boolean
   */
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Use the useEffect hook to make an API call to the backend
   * when the component is first rendered.
   */
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:${Config.PORT}/monster`)
      .then((response) => {

        // Update the monsters array with the data that was returned
        setMonsters(response.data);
        // Set isLoading to false since the data is no longer loading
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

        // If the data is still loading, display a loading message.
        <p>Loading...</p>
      ) : (

        // If the data is done loading, display the data in a list.
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

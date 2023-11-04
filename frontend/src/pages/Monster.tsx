import { useEffect, useState } from "react"
import axios from 'axios'

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

  const [monsters, setMonsters] = useState<MonsterInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  // const {timeoutSeconds, start} = useCountdown();

  /**
   * Use the useEffect hook to make an API call to the backend
   * when the component is first rendered.
   */
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:${Config.PORT}/monster`)
      .then((response) => {

        // start(Scheduler.instance().getCurrentTime());
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

  /** 
   * @arg monsters: A Monster object
   * @arg isLoading
   * @arg timeoutSecondsSS
  */
  return (
    <>
      <h1>Monster</h1>
     
      {isLoading ? (

        // If the data is still loading, display a loading message.
        <p>Loading...</p>
      ) : (

        // If the data is done loading, display the data in a list.
        <div>
{/* 
          {dayjs()
            .set("hour", 0)
            .set("minute", 0)
            .set("second", timeoutSeconds)
            .format("hh:mm:ss")} */}

          {monsters.map((monster) => (
            <div key={monster.monster_id}>
              <img src={monster.image_url} alt={monster.monster_name}/>
              <h2>{monster.monster_name}</h2>
              <p>Element: {monster.element}</p>
              <p>Rarity: {monster.rarity}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
};

export default Monster;

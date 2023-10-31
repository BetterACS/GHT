/**
 * @fileoverview Interface for monster data from the nosql database.
 */
interface monsterInterface {
  monster_id: number;
  monster_name: string;
  element: string;
  rarity: number;
  tame_rate: number;
  image_url: string;
  foods: {
    [key: string]: number;
  };
}

export { monsterInterface };

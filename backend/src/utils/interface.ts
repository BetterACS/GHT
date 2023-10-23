interface FavoriteFoodInterface {
  food_id: number;
}

interface MonsterInterface {
  monster_id: number;
  monster_name: string;
  element: string;
  rarity: number;
  tame_rate: number;
  foods: FavoriteFoodInterface[];
}

interface ItemInterface {
  item_id: number;
  item_name: string;
  item_description: string;
  item_type: string;
  item_rarity: number;
}

export { MonsterInterface, ItemInterface };

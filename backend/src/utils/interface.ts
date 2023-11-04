/**
 * @fileoverview Interface for monster data from the nosql database.
 */

import { Document } from "mongoose";

interface MonsterInterface {
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

interface InventoryInterface {
  [item_id: string]: number;
}

interface FieldInterface {
  [monster_id: string]: number;
}

interface UserStoragesInterface {
  email: string;
  field: FieldInterface;
}

export {
  MonsterInterface,
  UserStoragesInterface,
  InventoryInterface,
  FieldInterface,
};

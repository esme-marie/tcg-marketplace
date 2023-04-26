import styles from "../styles/PokemonCards.module.css";
import Image from "next/image";
import NoImage from "../assets/images/noImage.png";

import type { NextComponentType, NextPageContext } from "next";

interface Props {
  id: string;
  name: string;
  cardmarket: any;
  images: any;
  set: any;
  rarity: string;
  handleClick: (id: string) => void;
  cartItem: any;
}

const PokemonCards: NextComponentType<NextPageContext, {}, Props> = ({
  id,
  name,
  cardmarket,
  images,
  set,
  rarity,
  handleClick,
  cartItem,
}: Props) => {
  return (
    <div className={styles.pokemon_cards_container}>
      <div className={styles.pokemon_img}>
        <Image
          src={images ? images.large : NoImage}
          alt={"No Image"}
          width={194.37}
          height={271.13}
        />
      </div>
      <div className={styles.pokemon_cards}>
        <div style={{ width: "80%" }}>
          <div className={styles.pokemon_title}>{name}</div>
          <div className={styles.pokemon_rarity}>
            {rarity ? rarity : "unknown"}
          </div>
          <div className={styles.pokemon_details}>
            <div>$ {cardmarket ? cardmarket.prices.averageSellPrice : "-"}</div>
            <div>{cardmarket ? set.total : 0} left</div>
          </div>
          {cardmarket && (
            <>
              {!cartItem.find((item: any) => item.id === id) ? (
                <div
                  className={styles.pokemon_select}
                  onClick={() => handleClick(id)}
                >
                  Select card
                </div>
              ) : (
                <div
                  className={styles.pokemon_selected}
                  onClick={() => handleClick(id)}
                >
                  Selected
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCards;

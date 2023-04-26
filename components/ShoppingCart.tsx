import type { NextComponentType, NextPageContext } from "next";
import styles from "./../styles/ShoppingCart.module.css";
import Image from "next/image";
import Loader from "./Loader";
import DeleteQTY from "../assets/images/DeleteQty.svg";
import Increase from "../assets/images/Increase.svg";
import Decrease from "../assets/images/Decrease.svg";

interface Props {
  id: string;
  data: any;
  handleIncrease: (id: string) => void;
  handleDecrease: (id: string) => void;
  deleteItem: (id: string) => void;
  cartItem: any;
}

const ShoppingCart: NextComponentType<NextPageContext, {}, Props> = ({
  id,
  data,
  cartItem,
  handleDecrease,
  handleIncrease,
  deleteItem,
}: Props) => {
  let data_filter = null;
  let qty = 0;
  if (data) {
    const find = data.find((item: any) => item.id === id);
    data_filter = find;
    console.log(data_filter);
  }
  if (cartItem) {
    const find = cartItem.find((item: any) => item.id === id);
    console.log(find.qty);

    if (find) {
      qty = find.qty;
    }
  }
  return (
    <>
      {data_filter ? (
        <div className={styles.shopping_cart_container}>
          <div style={{ display: "flex" }}>
            {data_filter ? (
              <Image
                src={data_filter.images.small && data_filter.images.small}
                alt="Shopping Cart"
                width={77}
                height={106}
              />
            ) : (
              <div className="loader">
                <Loader />
              </div>
            )}
            <div style={{ margin: "10px 0px 10px 20px" }}>
              <div className={styles.cart_item_details}>
                <div>
                  <div className={styles.cart_item_title}>
                    {data_filter.name}
                  </div>
                  <div style={{ display: "flex" }}>
                    <div className={styles.cart_item_price}>
                      $ {data_filter.cardmarket.prices.averageSellPrice}
                    </div>
                    <div className={styles.cart_price_unit}>Per card</div>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div className={styles.cart_stock_qty}>
                    {Number(data_filter.set.total) - Number(qty)}
                  </div>
                  <div className={styles.cart_stock_left}>left</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "end",
              }}
            >
              <div className={styles.cart_total_qty}>{qty}</div>
              <div style={{ position: "relative", top: "-8px", left: "5px" }}>
                {qty < data_filter.set.total ? (
                  <div
                    onClick={() => handleIncrease(id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image src={Increase} alt="Increase" />
                  </div>
                ) : (
                  <div></div>
                )}

                {qty === 1 ? (
                  <div
                    onClick={() => deleteItem(id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image src={DeleteQTY} alt="Delete" />
                  </div>
                ) : (
                  <div
                    onClick={() => handleDecrease(id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image src={Decrease} alt="Decrease" />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.cart_total_price_}>price</div>
            <div className={styles.cart_price_data}>
              ${" "}
              {Number(
                Number(data_filter.cardmarket.prices.averageSellPrice) *
                  Number(qty)
              ).toFixed(2)}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="loader">
            <Loader />
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCart;

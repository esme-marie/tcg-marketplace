import Loader from "../components/Loader";
import SearchOptions from "../components/SearchOptions";
import PokemonCards from "../components/PokemonCards";
import ShoppingCart from "@/components/ShoppingCart";
import { useEffect, useState } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import CartIcon from "../assets/images/Cart.svg";
import CloseIcon from "../assets/images/Close.svg";
import SuccessIcon from "../assets/images/Success.svg";

const HomePage = ({
  cards,
  types,
  rarities,
  sets,
  cart,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [data, setData] = useState<any>([]);
  const [typesData, setTypesData] = useState<any>([]);
  const [raritiesData, setRaritiesData] = useState<any>([]);
  const [setsData, setSetsData] = useState<any>([]);
  const [dataLoading, setDataLoading] = useState<Boolean>(true);
  const [dataCart, setDataCart] = useState<any>([]);
  const [type, setType] = useState<any>([]);
  const [rarity, setRarity] = useState<any>([]);
  const [set, setSet] = useState<any>([]);
  const [cartItem, setCartItem] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [pageCount, setPagecount] = useState<number>(12);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  let totalCard = 0;
  let totalPrice = 0;

  const url = "https://api.pokemontcg.io/v2";
  const APIKey = "063b7ca5-4a64-46fb-a7ac-524005db5eb4";

  // Load more data per page
  const addData = async () => {
    const pagesize = pageCount + 12;

    const res = await fetch(`${url}/cards/?pageSize=${pagesize}`, {
      method: "GET",
      headers: {
        "X-Api-Key": APIKey,
      },
    });
    try {
      const data = await res.json();
      if (res.ok) {
        setData(data.data);
        setPagecount(data.data.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter pokemon cards by name
  const nameFilter = (e: string) => {
    if (e === "") {
      loadData();
    } else {
      try {
        fetch(`${url}/cards?q=name:${e}*`, {
          method: "GET",
          headers: {
            "X-Api-Key": APIKey,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              setData(data.data);
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Filter pokemon cards by type
  const typeFilter = (value: any) => {
    try {
      fetch(`${url}/cards?q=types:${value.value}`, {
        method: "GET",
        headers: {
          "X-Api-Key": APIKey,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setData(data.data);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Filter pokemon cards by rarity
  const rarityFilter = (value: any) => {
    try {
      fetch(`${url}/cards?q=rarity:${JSON.stringify(value.value)}`, {
        method: "GET",
        headers: {
          "X-Api-Key": APIKey,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setData(data.data);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Filter pokemon cards by set
  const setFilter = (value: any) => {
    try {
      fetch(`${url}/cards?q=set.name:${JSON.stringify(value.value)}`, {
        method: "GET",
        headers: {
          "X-Api-Key": APIKey,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setData(data.data);
          }
          console.log("data: ", data.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Reload data
  const loadData = () => {
    if (cards) {
      setDataLoading(true);
      setData(cards.data);
    }
    setDataLoading(false);
  };

  useEffect(() => {
    setDataLoading(true);

    // Set pokemon cards data to render
    if (cards) {
      setData(cards.data);
      setDataLoading(false);
    }

    // Set types data to render
    if (types) {
      setTypesData(types.data);
      setDataLoading(false);
    }

    // Set rarities data to render
    if (rarities) {
      setRaritiesData(rarities.data);
      setDataLoading(false);
    }

    // Set sets data to render
    if (sets) {
      setSetsData(sets.data);
      setDataLoading(false);
    }

    // Set cart data to render
    if (cart) {
      setDataCart(cart.data);
      setDataLoading(false);
    }
  }, [cards, types, rarities, sets, cart]);

  // Loading type options & crosscheck duplicate data
  if (typesData.length > 0) {
    typesData.map((t: any) => {
      const find = type.find((x: any) => x.value === t);
      if (!find) {
        type.push({
          value: t,
          label: t,
        });
        setType((options: any) => [...options]);
      }
    });
  }

  // Loading rarity options & crosscheck duplicate data
  if (raritiesData.length > 0) {
    raritiesData.map((r: any) => {
      const find = rarity.find((x: any) => x.value === r);
      if (!find) {
        rarity.push({
          value: r,
          label: r,
        });
        setRarity((options: any) => [...options]);
      }
    });
  }

  // Loading set options & crosscheck duplicate data
  if (setsData.length > 0) {
    setsData.map((s: any) => {
      const find = set.find((x: any) => x.value === s.name);
      if (!find) {
        set.push({
          value: s.name,
          label: s.name,
        });
        setSet((options: any) => [...options]);
      }
    });
  }

  // Sum up final total card & price in cart
  if (cartItem.length > 0) {
    cartItem.map((card: any) => {
      totalCard = totalCard + card.qty;
      const find = data.find((data: any) => data.id === card.id);
      if (find) {
        let total = card.qty * find.cardmarket.prices.averageSellPrice;
        totalPrice = totalPrice + total;
      }
    });
  }

  // Select card / add to cart
  const handleClick = (id: string) => {
    const find = cartItem.find((item: any) => item.id === id);
    if (find) {
      const filter = cartItem.filter((item: any) => item.id !== id);
      setCartItem([...filter]);
    } else {
      setCartItem((curr: any) => [...curr, { id: id, qty: 1 }]);
    }
  };

  // Clear input value upon click
  const clearInput = () => {
    (document.getElementById("input") as HTMLInputElement).value = "";
    loadData();
  };

  // Clear cart & back to cards
  const handleClear = () => {
    setCartItem([]);
    setOpen(false);
  };

  // Increase cart item
  const handleIncrease = (id: string) => {
    const find = cartItem.find((item: any) => item.id === id);
    if (find) {
      find.qty = find.qty + 1;
      setCartItem((curr: any) => [...curr]);
    }
  };

  // Decrease cart item
  const handleDecrease = (id: string) => {
    const find = cartItem.find((item: any) => item.id === id);
    if (find) {
      find.qty = find.qty - 1;
      setCartItem((curr: any) => [...curr]);
    }
  };

  // Delete cart item
  const deleteItem = (id: string) => {
    const find = cartItem.find((item: any) => item.id === id);
    if (find) {
      const filter = cartItem.filter((item: any) => item.id !== id);
      setCartItem([...filter]);
    }
  };

  return (
    <>
      {dataLoading ? (
        <div className="loader">
          <Loader />
        </div>
      ) : (
        <main>
          <div className="filter_container">
            <div className="search_bar">
              <input
                id="input"
                placeholder="Name.."
                className="input"
                onChange={(e) => nameFilter(e.target.value)}
                onClick={clearInput}
              />
              <div className="search_options">
                <div>
                  <SearchOptions
                    isMulti={false}
                    last={false}
                    placeHolder="Type"
                    options={type}
                    onChange={(value) => typeFilter(value)}
                  />
                </div>
                <div>
                  <SearchOptions
                    isMulti={false}
                    last={false}
                    placeHolder="Rarity"
                    options={rarity}
                    onChange={(value) => rarityFilter(value)}
                  />
                </div>
                <div>
                  <SearchOptions
                    isMulti={false}
                    last={true}
                    placeHolder="Set"
                    options={set}
                    onChange={(value) => setFilter(value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="cards_container">
            {data.map((card: any) => (
              <div key={card.id}>
                <PokemonCards
                  {...card}
                  handleClick={handleClick}
                  cartItem={cartItem}
                />
              </div>
            ))}
          </div>

          <InfiniteScroll
            style={{ overflowY: "hidden" }}
            dataLength={data.length}
            scrollableTarget="scrollableDiv"
            loader={
              <div className="infinite_loader">
                <Loader />
              </div>
            }
            next={() => {
              addData();
            }}
            hasMore={data.length > 245 ? false : true}
          >
            {dataLoading ? (
              <div className="infinite_loader">
                <Loader />
              </div>
            ) : (
              <div className="cards_container">
                {data.map((card: any) => (
                  <div key={card.id}>
                    <PokemonCards
                      {...card}
                      handleClick={handleClick}
                      cartItem={cartItem}
                    />
                  </div>
                ))}
              </div>
            )}
          </InfiniteScroll>

          {!open ? (
            <div
              className="view_cart_button"
              onClick={() => {
                setOpen(true);
                setPaymentSuccess(false);
              }}
            >
              <div style={{ position: "relative" }}>
                <div className="cart_total_items">{cartItem.length}</div>
              </div>
              <Image src={CartIcon} alt="Cart" />
              View Cart
            </div>
          ) : (
            <div className="cart_close_button" onClick={() => setOpen(false)}>
              <Image src={CloseIcon} alt="Close" />
            </div>
          )}
          {open && (
            <>
              {paymentSuccess ? (
                <div className="cart_container payment_success">
                  <div className="payment_success">
                    <Image
                      src={SuccessIcon}
                      alt="Success"
                      style={{ margin: "20px" }}
                    />
                    Payment success!
                  </div>
                </div>
              ) : cartItem.length == 0 ? (
                <div className="cart_container payment_success">
                  Your cart is empty.
                </div>
              ) : (
                <div className="cart_container">
                  <div className="cart_items">
                    {cartItem.map((item: any) => (
                      <div key={item.id}>
                        <ShoppingCart
                          {...item}
                          data={dataCart}
                          cartItem={cartItem}
                          handleDecrease={handleDecrease}
                          handleIncrease={handleIncrease}
                          deleteItem={deleteItem}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="cart_total_container">
                    <div className="cart_clear_all" onClick={handleClear}>
                      Clear all
                    </div>
                    <div className="cart_total">
                      <div className="cart_total_details">
                        <div className="cart_total_cards_title">
                          Total cards
                        </div>
                        <div className="cart_total_cards_text">{totalCard}</div>
                      </div>
                      <div className="cart_total_details">
                        <div className="cart_total_price_title">
                          Total price
                        </div>
                        <div className="cart_total_price_title_text">
                          $ {totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div
                      className="cart_pay_button"
                      onClick={() => {
                        setPaymentSuccess(true);
                        setCartItem([]);
                      }}
                    >
                      Pay now
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      )}
    </>
  );
};
export default HomePage;

export const getStaticProps: GetStaticProps = async () => {
  const APIKey = "063b7ca5-4a64-46fb-a7ac-524005db5eb4";
  const url = "https://api.pokemontcg.io/v2";

  try {
    // Get pokemon cards data with error handling
    const res = await fetch(`${url}/cards/?pageSize=12`, {
      method: "GET",
      headers: {
        "X-Api-Key": APIKey,
      },
    });
    const data = await res.json();

    if (data.errors) {
      throw data.errors;
    }

    if (!data.data) {
      throw { message: "No data" };
    }

    // Get type data with error handling
    const typeRes = await fetch(`${url}/types`, {
      method: "GET",
      headers: {
        "X-Api-Key": APIKey,
      },
    });
    const typesData = await typeRes.json();

    if (typesData.errors) {
      throw typesData.errors;
    }

    if (!typesData.data) {
      throw { message: "No data" };
    }

    // Get rarity data with error handling
    const rarityRes = await fetch(`${url}/rarities`, {
      method: "GET",
      headers: {
        "X-Api-Key": APIKey,
      },
    });
    const raritiesData = await rarityRes.json();

    if (raritiesData.errors) {
      throw raritiesData.errors;
    }

    if (!raritiesData.data) {
      throw { message: "No data" };
    }

    // Get set data with error handling
    const setRes = await fetch(`${url}/sets`, {
      method: "GET",
      headers: {
        "X-Api-Key": APIKey,
      },
    });
    const setsData = await setRes.json();

    if (setsData.errors) {
      throw setsData.errors;
    }

    if (!setsData.data) {
      throw { message: "No data" };
    }

    // Get cart data with error handling
    const cartRes = await fetch(`${url}/cards`, {
      method: "GET",
      headers: {
        "X-Api-Key": APIKey,
      },
    });
    const cartData = await cartRes.json();

    if (cartData.errors) {
      throw cartData.errors;
    }

    if (!cartData.data) {
      throw { message: "No data" };
    }

    return {
      props: {
        cards: data,
        types: typesData,
        rarities: raritiesData,
        sets: setsData,
        cart: cartData,
      },
    };
  } catch (error) {
    console.log(error, "Error in fetching props.");
    return { props: {} };
  }
};

import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Banner from "./components/banner";
import Image from "next/image";
import Card from "./components/card";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
import {useContext, useEffect, useState} from "react";
import {ACTION_TYPES, StoreContext} from "../store/store-context";

const defaultImage = `https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80`;
export async function getStaticProps(context) {
    const coffeeStores = await fetchCoffeeStores();
    return {
        props: {
            coffeeStores,
        },
    }
}
export default function Home(props) {
    const { trackLocationHandler, locationError, isFindingLocation } = useTrackLocation();
    const [fetchCoffeeStoresError, setFetchCoffeeStoresError] = useState('');
    const { dispatch, state } = useContext(StoreContext);
    const { coffeeStores, latLong } = state;

    useEffect(() => {
        dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {coffeeStores: props.coffeeStores},
        });
        const fetchCoffeeStoresByLatLong = async () => {
            if(latLong) {
                try {
                    const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30);
                    dispatch({
                        type: ACTION_TYPES.SET_COFFEE_STORES,
                        payload: {coffeeStores: fetchedCoffeeStores},
                    });
                    setFetchCoffeeStoresError("");
                } catch (error) {
                    setFetchCoffeeStoresError(error.message);
                }
            }
        }
        fetchCoffeeStoresByLatLong();
    }, [latLong, dispatch]);
    const bannerButtonClickHandler = () => trackLocationHandler();
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <Banner
              buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
              buttonClickHandler={bannerButtonClickHandler}
          />
          { locationError && <p>Something Went Wrong! ${locationError}</p>}
          <div className={styles.heroImage}>
              <Image src="/static/hero-image.png" width={700} height={400}/>
          </div>
          {coffeeStores.length > 0 &&
              <div className={styles.sectionWrapper}>
                  { (latLong) ?
                      (<h2 className={styles.heading2}>Stores near me</h2>) :
                      (<h2 className={styles.heading2}>Houston Texas stores</h2>)}

                  <div className={styles.cardLayout}>
                      {coffeeStores.map((store) => {
                          return (
                              <Card key={store.id}
                                    name={store.name}
                                    imageUrl={store.imgUrl || `${defaultImage}`}
                                    href={`/coffee-store/${store.id}`}
                              />
                          );
                      })}
                  </div>
              </div>
          }
      </main>
    </div>
  )
}

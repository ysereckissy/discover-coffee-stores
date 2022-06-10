import {useRouter} from "next/router";
import Link from "next/link";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import Head from "next/head";
import cls from "classnames"
import {fetchCoffeeStores} from "../../lib/coffee-stores";
import {useContext, useEffect, useState} from "react";
import {StoreContext} from "../../store/store-context";
import {isEmpty} from "../../utils";

const defaultImage = `https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80`;

export async function getStaticProps({params}) {
    const coffeeStores = await fetchCoffeeStores();
    return {
        props: {
           coffeeStore: coffeeStores.find(store => store.id.toString() === params.id) || {},
        },
    };
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map(store => ({
        params: {
            id: store.id.toString(),
        }
        }));
    return {
        paths,
        fallback: true,
    };
}
const CoffeeStore = (props) => {
    const router = useRouter();
    const id = router.query.id;
    console.log("route Id: ", id);
    const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore || {});
    const {
        state: { coffeeStores }
    } = useContext(StoreContext);

    const upvoteHandler = () => {
        console.log("Up voted!");
    }
    console.log("coffeeStore value: ", coffeeStore);
    const createCoffeeStoreHandler = async (data) => {
        const {id, name,imgUrl, neighbourhood, address} = data;
        try {
            const response = await fetch('/api/create-coffee-store', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    name,
                    voting: 0,
                    imgUrl,
                    neighbourhood: neighbourhood || "",
                    address: address || ""
                }),
            });
            return await response.json();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if(isEmpty(props.coffeeStore)) {
            if(coffeeStores.length > 0) {
                const storeById = coffeeStores.find(store => store.id.toString() === id);
                console.log("store by ID: ", storeById);
                if(storeById){
                    setCoffeeStore(storeById);
                    createCoffeeStoreHandler(storeById).then(data => console.log("From Context: ", data));
                }
            }
        } else {
            createCoffeeStoreHandler(props.coffeeStore).then(data => console.log("From SSR: ", data));
        }
    }, [id])

    const { address, name, neighbourhood, imgUrl} = coffeeStore;
    if(router.isFallback) {
        return <div>Loading...</div>
    }
    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                            <a> &#x21A4; Back to Home </a>
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image src={imgUrl || `${defaultImage}`} width={600} height={360} className={styles.storeImg} alt={name}/>
                </div>
                <div className={cls("glass", styles.col2)}>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/location.svg" width={24} height={24} />
                        <p className={styles.text}>{address}</p>
                    </div>
                    {(neighbourhood) &&
                        (<div className={styles.iconWrapper}>
                            <Image src="/static/icons/nearMe.svg" width={24} height={24} />
                            <p className={styles.text}>{neighbourhood}</p>
                        </div>)}
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/star.svg" width={24} height={24} />
                        <p className={styles.text}>1</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={upvoteHandler}>Up vote!</button>
                </div>
            </div>
        </div>
    );
};

export default CoffeeStore;
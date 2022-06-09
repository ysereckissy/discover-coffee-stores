import {useRouter} from "next/router";
import Head from "next/head";

const Slug = () => {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>{router.query.slug}</title>
            </Head>
            <h3>Dynamic route: {router.query.slug}</h3>
        </>
    );
};

export default Slug;
import Document, {Html, Head, Main, NextScript} from "next/document";

class MyDocument extends Document {
    render() {
        return <Html lang="en">
            <Head>
                <link
                    rel="prefetch"
                    href="/fonts/IBMPlexSans-Bold.ttf"
                    as="font"
                    crossOrigin="anonymous"
                ></link>
                <link
                    rel="prefetch"
                    href="/fonts/IBMPlexSans-Regular.ttf"
                    as="font"
                    crossOrigin="anonymous"
                ></link>
                <link
                    rel="prefetch"
                    href="/fonts/IBMPlexSans-SemiBold.ttf"
                    as="font"
                    crossOrigin="anonymous"
                ></link>
            </Head>
            <body>
            <Main> </Main>
            <NextScript />
            </body>
        </Html>
    }
}

export default MyDocument;
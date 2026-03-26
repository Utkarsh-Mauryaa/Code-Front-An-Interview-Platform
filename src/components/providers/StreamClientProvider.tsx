"use client"

import {ReactNode, useEffect, useState} from "react";
import {StreamVideoClient, StreamVideo} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import LoaderUI from "../LoaderUI";
import { streamTokenProvider } from "@/actions/stream.actions";


// this is the overall flow that we are doing
// Your app → Stream SDK → Stream servers → other users
// basically we are generating a client and this client connect to the stream servers and then the server handles webrtc, signaling and streaming audio or video
const StreamClientProvider = ({children}: {children: ReactNode}) => {
    const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>(); // we are creating a stream client for a particular client

    const {user, isLoaded} = useUser(); // this will give us the user object and here isLoaded is opposite of isLoading

    useEffect(() => {
        if(!isLoaded || !user) return;

        const client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!, // Imp: Only variables prefixed with NEXT_PUBLIC_ are exposed to the browser
            user: {
                id: user?.id,
                name: user?.firstName || "" + " " + user?.lastName || "" || user?.id,
                image: user?.imageUrl,
            },
            tokenProvider: streamTokenProvider, // this function will run on the server
        });
        setStreamVideoClient(client);

        return () => { client.disconnectUser(); }; // enclosed in {} because useEffect's cleanup expects to return void but this disconnectUser returns a promise

    }, [user?.id, isLoaded]);

    if(!streamVideoClient) return <LoaderUI/>

    return (
        <StreamVideo client={streamVideoClient}>
            {children}
        </StreamVideo>
    );
}

export default StreamClientProvider;
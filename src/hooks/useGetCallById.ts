import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { ParamValue } from "next/dist/server/request/params";

const useGetCallById = (id: ParamValue) => {
    const [call, setCall] = useState<Call>();
    const [isCallLoading, setIsCallLoading] = useState(true);
    const client = useStreamVideoClient();

    useEffect(() => {
        if (!client) return;
        const getCall = async () => {
            try {
                const { calls } = await client.queryCalls({ filter_conditions: { id } });
                if (calls.length > 0) setCall(calls[0]);

            } catch (error) {
                console.error(error);
            } finally {
                setIsCallLoading(false);
            }
        };
        getCall();

    }, [client, id]);

    return { call, isCallLoading };

}

export default useGetCallById;

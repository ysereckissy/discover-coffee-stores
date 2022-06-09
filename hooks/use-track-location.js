import {useContext, useState} from "react";
import {ACTION_TYPES, StoreContext } from "../store/store-context";

const useTrackLocation = () => {
    const [locationError, setLocationError] = useState('');
    ///const [latLong, setLatLong] = useState('')
    const [isFindingLocation, setIsFindingLocation] = useState(false);
    const { dispatch } = useContext(StoreContext)

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        ///setLatLong(`${latitude},${longitude}`);
        dispatch({
            type: ACTION_TYPES.SET_LAT_LONG,
            payload: {latLong: `${latitude},${longitude}`},
        })
        setLocationError('');
        setIsFindingLocation(false);
    };
    const error = () => {
        setLocationError('Unable to retrieve your location');
        setIsFindingLocation(false);
    };
    const trackLocationHandler = () => {
        if(!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
        } else {
            setIsFindingLocation(true);
            navigator.geolocation.getCurrentPosition(success, error);
        }
    };
    return {
        trackLocationHandler,
        locationError,
        isFindingLocation,
    }
}

export default useTrackLocation;
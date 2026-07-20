import {create} from 'zustand';
import axios from 'axios';

const BACKEND_URL = "http://localhost:4444"

export const useFunctionalityItemData = create((set, get) => ({
    //functionalityItem state
    functionalityItem: [],
    loading: false,
    error: null,

    fetchFunctionalityItem: async () => {
        set({loading:true});
        try{
            const response = await axios.get(`${BACKEND_URL}/api/functionalityItem`)
            set({functionalityItem:response.data.data, error:null}); // the data.data thing is due to the nature of controller from backend/routes/speciesRoutes.js
        }
        catch (err) {
            if (err.status == 429){
                set ({error: "Rate Limit Exceeded."});
            }
            else {
                set ({error: "Something went wrong..."});
            }
        }

        finally {
            set({loading:false});
        }

    }
}));
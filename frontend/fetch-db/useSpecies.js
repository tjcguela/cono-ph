import {create} from 'zustand';
import axios from 'axios';

const BACKEND_URL = "http://localhost:4444"

export const useSpeciesData = create((set, get) => ({
    //species state
    species: [],
    loading: false,
    error: null,

    fetchSpecies: async () => {
        set({loading:true});
        try{
            const response = await axios.get(`${BACKEND_URL}/api/species`)
            set({species:response.data.data, error:null}); // the data.data thing is due to the nature of controller from backend/routes/speciesRoutes.js
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
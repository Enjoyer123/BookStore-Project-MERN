import axios from "axios";

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + url);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const postData = async (url, formData) => {

    try {
        const response = await fetch(import.meta.env.VITE_API_URL + url, {
            method: 'POST',
            headers: {
                // 'Authorization': `Bearer ${token}`, // Include your API key in the Authorization header
                'Content-Type': 'application/json', // Adjust the content type as needed
              },
           
            body: JSON.stringify(formData)
        });


      

        if (response.ok) {
            const data = await response.json();
           
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }

    } catch (error) {
        console.error(error);
    }


}

export const editData = async (url, updateData) => {
    try {
       
        const { data } = await axios.put(`${import.meta.env.VITE_API_URL}${url}`, updateData);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteData = async (url) => {
    try {
        const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}${url}`);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const uploadImage = async (url, formData) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}${url}`, formData);
        console.log(data)
        return data;
    } catch (error) {
        console.log(error);
        console.log('Error Response:', error.response.data);
        return error;
    }
}

export const deleteImages = async (url, image) => {
    try {
        const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}${url}`, image);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

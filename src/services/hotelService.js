export const hotelService = {
    async searchHotels(params) {
        try {
            const queryParams = new URLSearchParams();
            if (params.destination) queryParams.append('destination', params.destination);
            if (params.checkIn) queryParams.append('checkIn', params.checkIn);
            if (params.checkOut) queryParams.append('checkOut', params.checkOut);
            if (params.adults) queryParams.append('adults', params.adults.toString());
            if (params.children) queryParams.append('children', params.children.toString());
            if (params.rooms) queryParams.append('rooms', params.rooms.toString());

            const response = await fetch(`/api/hotels/search?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch hotels');
            }
            return await response.json();
        } catch (error) {
            console.error('Error in searchHotels:', error);
            throw error;
        }
    }
};

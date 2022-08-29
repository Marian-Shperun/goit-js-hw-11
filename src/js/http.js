import axios from 'axios'
import { Notify, Loading } from 'notiflix';

const API_KEY = '?key=29509345-cfcaf8921b6a1b9546e29ba3a';
const PARAMETERS = '&image_type=photo&orientation=horizontal&safesearch=true';

export async function fetchData(query, currentPage, HITS_PAGE) {
  try {
    axios.defaults.baseURL = 'https://pixabay.com/api/';

    const response = await axios.get(
      `${API_KEY}&q=${query}${PARAMETERS}&page=${currentPage}&per_page=${HITS_PAGE}`
    );
    return await response.data;
  } catch (e) {
    Notify.failure(e.message, {
      position: 'center-center',
    });
    Loading.remove();
  }
}




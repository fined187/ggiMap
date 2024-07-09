import { SidoProps } from "@/models/Juso";
import axios from "axios";
import { useQuery } from "react-query";

const fetchSidoList = async (): Promise<SidoProps[]> => {
  try {
    const { data } = await axios.get(`/ggi/api/location/sds`);
    if (data.success) {
      return [...data.data.sds, { sd: ' ', x: 0, y: 0 }];
    }
  } catch (error) {
    throw new Error('시/도 리스트를 가져오는데 실패했습니다.');
  }
  return [];
}

export default function useGetSidoList() {
  return useQuery<SidoProps[], Error>('sidoList', fetchSidoList);
}

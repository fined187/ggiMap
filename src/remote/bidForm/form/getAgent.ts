import axios from 'axios'

export default async function getAgents(seq: number, idNum: string) {
  const agentList = await axios.get(`/ggi/api/bid-form/${seq}/agents`)
  return {
    agentIdNum: idNum,
    ...agentList.data.data,
  }
}

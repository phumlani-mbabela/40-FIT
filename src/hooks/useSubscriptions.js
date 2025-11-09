import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
const API = '/api' // replace with your backend
export function useSubscriptions(userId){
  const qc = useQueryClient()
  const q = useQuery(['subscriptions', userId], async ()=> {
    const r = await axios.get(`${API}/subscriptions?user=${userId}`)
    return r.data
  })
  const add = useMutation(async (payload)=> axios.post(`${API}/subscriptions`, payload), {
    onMutate: async (newSub) => {
      await qc.cancelQueries(['subscriptions', userId])
      const prev = qc.getQueryData(['subscriptions', userId])
      qc.setQueryData(['subscriptions', userId], old => old ? [...old, newSub] : [newSub])
      return {prev}
    },
    onError: (err, newSub, ctx) => { qc.setQueryData(['subscriptions', userId], ctx.prev) }
  })
  return { ...q, add }
}

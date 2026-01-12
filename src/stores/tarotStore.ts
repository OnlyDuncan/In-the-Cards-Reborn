import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

export interface TarotCard {
  id: string
  name: string
  description: string
  meaning?: string
  // Add other card properties as needed
}

export const useTarotStore = defineStore('tarot', {
  state: () => ({
    cards: [] as TarotCard[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchCards() {
      try {
        this.loading = true
        this.error = null
        
        const cardsRef = collection(db, 'cards')
        const snapshot = await getDocs(cardsRef)
        
        const cardsList: TarotCard[] = []
        snapshot.forEach(doc => {
          console.log(doc.id, doc.data())
          cardsList.push({
            id: doc.id,
            ...doc.data()
          } as TarotCard)
        })
        
        this.cards = cardsList
      } catch (err) {
        console.error('Error fetching cards:', err)
        this.error = 'Failed to fetch cards from database'
      } finally {
        this.loading = false
      }
    },

    getCardById(id: string): TarotCard | undefined {
      return this.cards.find((card: TarotCard) => card.id === id)
    },

    clearError() {
      this.error = null
    }
  }
})
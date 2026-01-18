import { defineStore } from 'pinia'
// @ts-ignore - Vue 3 import issue in TypeScript
import { ref, computed } from 'vue'
import { tarotCards } from '@/data/tarotCardData'

export interface CardData {
  name: string
  orientation: string
  description?: string
  meaning?: string
  image?: string
}

export const useTarotStore = defineStore('tarot', () => {
    // State
    const allCards = ref<CardData[][]>([])
    const loading = ref(false)
    const error = ref<Error | null>(null)
    const isInitialized = ref(false)

    // Getters
    const libraryCards = computed(() => 
        allCards.value.map((cardPair: any[]) => cardPair[0]).filter(Boolean)
    )

    const hasCards = computed(() => allCards.value.length > 0)

    // Actions
    const fetchCards = async () => {
        if (isInitialized.value && hasCards.value) {
            return
        }
        loading.value = true
        error.value = null

        try {
            allCards.value = tarotCards
            isInitialized.value = true
            console.log('Cards fetched successfully', { cardCount: tarotCards.length })
        } catch (err: any) {
            console.error('Error fetching cards:', err)
            error.value = err
        } finally {
            loading.value = false
        }
    }

    const forceRefresh = async () => {
        isInitialized.value = false
        await fetchCards()
    }

    const getRandomCard = () => {
        if (libraryCards.value.length === 0) return null
        const randomIndex = Math.floor(Math.random() * libraryCards.value.length)
        return libraryCards.value[randomIndex]
    }

    const getCardByName = (name: string, orientation: 'Upright' | 'Reversed' = 'Upright') => {
        const cardPair = allCards.value.find((pair: any) =>
            pair.some((card: any) => card.name === name)
        )
        return cardPair?.find((card: any) => card.orientation === orientation) || null
    }

    return {
        // State
        allCards,
        loading,
        error,
        isInitialized,

        // Getters
        libraryCards,
        hasCards,

        // Actions
        fetchCards,
        forceRefresh,
        getRandomCard,
        getCardByName
    }
})
import { writable } from 'svelte/store'
import { supabase } from '$lib/supabase/supabase.client'

function createAuthStore() {
  const { subscribe, set } = writable(null)

  return {
    subscribe,
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return data
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set(data.user)
      return data
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set(null)
    },
    // Initialize the store with the current session
    init: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      set(user)
    }
  }
}

export const authStore = createAuthStore()
// Initialize the store
authStore.init()
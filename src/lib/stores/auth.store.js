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
      window.dispatchEvent(new Event('auth-signin'))
      return data
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set(null)
      window.dispatchEvent(new Event('auth-signout'))
    },
    init: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      set(user)
      if (user) {
        window.dispatchEvent(new Event('auth-signin'))
      }
    }
  }
}

export const authStore = createAuthStore()
authStore.init()
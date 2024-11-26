import { writable } from 'svelte/store'
import { supabase } from '$lib/supabase/supabase.client'

function createNudgeStore() {
  const { subscribe, set, update } = writable([])

  const handleError = (error, revertFn) => {
    if (error) {
      if (revertFn) revertFn();
      console.error('Store operation failed:', error);
      throw error;
    }
  };

  // Add helper for optimistic updates
  const optimisticUpdate = (updateFn, revertFn) => {
    update(updateFn);
    return () => update(revertFn);
  };

  // Initialize sync with Supabase
  async function initializeSync() {
    const { data, error } = await supabase
      .from('nudges')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      set(data)
    }
  }

  // Add a Set to track pending inserts
  const pendingInserts = new Set();

  // Modify the subscription handler
  const subscription = supabase
    .channel('nudges_channel')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'nudges' },
      (payload) => {
        switch (payload.eventType) {
          case 'INSERT':
            update(nudges => {
              // If this was our optimistic update, just remove it from pending
              if (pendingInserts.has(payload.new.id)) {
                pendingInserts.delete(payload.new.id);
                // Replace the optimistic version with the server version
                return nudges.map(n =>
                  n.id === payload.new.id ? payload.new : n
                );
              }
              // Otherwise it's a new nudge from another client
              return [payload.new, ...nudges];
            });
            break;
          case 'UPDATE':
            update(nudges => {
              if (pendingUpdates.has(payload.new.id)) {
                pendingUpdates.delete(payload.new.id);
                return nudges; // Skip update as we already have it
              }
              return nudges.map(n =>
                n.id === payload.new.id ? payload.new : n
              );
            });
            break;
          case 'DELETE':
            update(nudges => {
              if (pendingDeletes.has(payload.old.id)) {
                pendingDeletes.delete(payload.old.id);
                return nudges; // Skip delete as we already did it
              }
              return nudges.filter(n => n.id !== payload.old.id);
            });
            break;
        }
      }
    )
    .subscribe();

  // Initialize sync on store creation
  initializeSync()

  return {
    subscribe,
    add: async (nudge) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      const newNudge = {
        id: crypto.randomUUID(),
        user_id: user.id,
        who: nudge.who ? nudge.who.trim() : 'Me',
        what: nudge.what,
        complete: false,
        created_at: new Date().toISOString()
      };

      // Track this insert
      pendingInserts.add(newNudge.id);

      const revert = optimisticUpdate(
        nudges => [newNudge, ...nudges],
        nudges => nudges.filter(n => n.id !== newNudge.id)
      );

      const { error } = await supabase
        .from('nudges')
        .insert([newNudge]);

      if (error) {
        pendingInserts.delete(newNudge.id);
        revert();
        handleError(error);
      }
    },

    update: async (id, newValue) => {
      const { data: currentNudge, error: fetchError } = await supabase
        .from('nudges')
        .select('*')
        .eq('id', id)
        .single();

      handleError(fetchError);

      const revert = optimisticUpdate(
        nudges => nudges.map(n => n.id === id ? { ...n, what: newValue } : n),
        nudges => nudges.map(n => n.id === id ? { ...n, what: currentNudge.what } : n)
      );

      const { error } = await supabase
        .from('nudges')
        .update({ what: newValue })
        .eq('id', id);

      handleError(error, revert);
    },

    toggle: async (id) => {
      // First get the current state
      const { data: currentNudge, error: fetchError } = await supabase
        .from('nudges')
        .select('complete')
        .eq('id', id)
        .single();

      handleError(fetchError);

      // Set up optimistic update
      const newComplete = !currentNudge.complete;
      const revert = optimisticUpdate(
        nudges => nudges.map(n =>
          n.id === id ? { ...n, complete: newComplete } : n
        ),
        nudges => nudges.map(n =>
          n.id === id ? { ...n, complete: currentNudge.complete } : n
        )
      );

      // Perform the actual update
      const { error } = await supabase
        .from('nudges')
        .update({ complete: newComplete })
        .eq('id', id);

      handleError(error, revert);
    },

    delete: async (id) => {
      const { data: nudgeToDelete, error: fetchError } = await supabase
        .from('nudges')
        .select('*')
        .eq('id', id)
        .single();

      handleError(fetchError);

      if (!nudgeToDelete?.complete) {
        throw new Error('Cannot delete incomplete nudge');
      }

      const revert = optimisticUpdate(
        nudges => nudges.filter(n => n.id !== id),
        nudges => [...nudges, nudgeToDelete]
      );

      const { error } = await supabase
        .from('nudges')
        .delete()
        .eq('id', id);

      handleError(error, revert);
    },

    destroy: () => {
      subscription.unsubscribe()
    }
  }
}

export const nudgeStore = createNudgeStore()
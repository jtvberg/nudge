<script>
  import { authStore } from '$lib/stores/auth.store';

  let email = '';
  let password = '';
  let error = null;

  async function handleSignup() {
    try {
      error = null;
      await authStore.signUp(email, password);
    } catch (e) {
      error = e.message;
    }
  }
</script>

<section class="gap-2 p-2 mt-2 h-screen w-3/4 justify-center self-center">
  <div class="text-lg font-bold mb-1">Sign Up</div>
  <form
    class="form-container form-container-dark flex flex-col gap-1"
    on:submit|preventDefault={handleSignup}
  >
    <div>
      <label for="email">Email</label>
      <input
        class="input-field input-field-dark"
        type="email"
        id="email"
        bind:value={email}
        required
      />
    </div>
    <div>
      <label for="password">Password</label>
      <input
        class="input-field input-field-dark mb-1"
        type="password"
        id="password"
        bind:value={password}
        required
      />
    </div>
    <button class="btn-primary py-1 rounded-md" type="submit">Sign Up</button>
    {#if error}
      <div class="text-lg text-red-500 h-4 self-center">{error}</div>
    {/if}
  </form>
</section>

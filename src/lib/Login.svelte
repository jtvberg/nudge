<script>
  import { authStore } from '$lib/stores/auth.store';

  let email = '';
  let password = '';
  let error = null;

  async function handleLogin() {
    try {
      error = null;
      await authStore.signIn(email, password);
    } catch (e) {
      error = e.message;
    }
  }
</script>

<section
  class="gap-2 p-2 mt-2 h-screen grid grid-rows-[min-content_1fr_min-content] w-3/4 justify-center self-center"
>
  <div class="text-lg font-bold">Login</div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <form
    class="form-container form-container-dark flex flex-col gap-1"
    on:submit|preventDefault={handleLogin}
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
        class="input-field input-field-dark"
        type="password"
        id="password"
        bind:value={password}
        required
      />
    </div>
    <button
      class="btn-primary btn-primary-dark px-2 py-1 rounded-lg [&&]:mb-2"
      type="submit">Login</button
    >
  </form>
</section>

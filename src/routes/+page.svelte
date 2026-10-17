<script lang="ts">
	import { Button } from '#lib/components/ui/index.ts';
	import { goto } from '$app/navigation';
</script>

<Button onclick={() => goto('/auth/sign-in')} class="rounded-lg bg-brand-blue px-4 py-2 text-white"
	>Login</Button
>

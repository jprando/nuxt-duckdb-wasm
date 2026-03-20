<script
  setup
  lang="ts"
>
import { useRouter } from 'vue-router'

const router = useRouter()

// Redireciona para o primeiro dashboard da lista
router.push('/pocs-v1/taxiNYCLocal')
</script>

<template>
  <div>Redirecionando...</div>
</template>

<script
  setup
  lang="ts"
>
defineProps<{
  colunas: string[]
  registros: Record<string, any>[]
}>();
</script>

<template>
  <table class="w-full">
    <thead class="text-justify">
      <th
        v-for="(nomeColuna, indexColuna) in colunas"
        :key="`${registros?.length || 0}:${indexColuna}`"
        class="px-5"
      >
        {{ nomeColuna }}
      </th>
    </thead>
    <tbody>
      <tr
        v-for="(itemRegistro, indexRegistro) in registros"
        :key="(registros?.length || 0) - indexRegistro"
        class="text-justify"
      >
        <td
          v-for="(nomeColuna, indexColuna) in colunas"
          :key="(registros?.length || 0) - indexColuna"
          class="px-5"
        >
          {{ itemRegistro?.[nomeColuna] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>